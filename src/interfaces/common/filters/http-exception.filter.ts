/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { randomUUID } from "crypto";

import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";

import { isApplicationError } from "@/application/errors";

import type { Request, Response } from "express";

type ErrorItem = { code: string; message: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toCode(raw: unknown, fallback = "HTTP_ERROR"): string {
  if (typeof raw !== "string") return fallback;
  const s = raw.trim();
  if (!s) return fallback;

  const withUnderscores = s
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s.-]+/g, "_");

  return withUnderscores
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .toUpperCase();
}

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const requestId = randomUUID();

    const isApp = isApplicationError(exception);
    const isHttp = exception instanceof HttpException;

    const status = isApp ? exception.httpStatus : isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errors = this.normalizeErrors(exception);

    const ex = exception as any;
    const cause = ex?.cause;

    Logger.error(
      {
        requestId,
        status,
        method: req.method,
        path: req.originalUrl,
        errors,
        exception: {
          name: ex?.name,
          message: ex?.message
        },
        cause: cause
          ? {
              name: cause?.name ?? "Error",
              message: String(cause?.message ?? cause)
            }
          : undefined
      },
      ex?.stack,
      "HttpExceptionsFilter"
    );

    res.setHeader("x-request-id", requestId);
    res.status(status).json({
      statusCode: status,
      errors,
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  private normalizeErrors(exception: unknown): ErrorItem[] {
    if (isApplicationError(exception)) return [{ code: exception.code, message: exception.message }];

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      const baseCode = toCode(isRecord(payload) ? payload.error : undefined, toCode(exception.name, "HTTP_ERROR"));

      if (typeof payload === "string") return [{ code: baseCode, message: payload }];

      if (isRecord(payload)) {
        const message = payload.message;

        if (Array.isArray(message))
          return message
            .filter((m): m is string => typeof m === "string")
            .map(msg => ({ code: baseCode, message: msg }));

        if (typeof message === "string") return [{ code: baseCode, message }];
      }

      return [{ code: baseCode, message: exception.message }];
    }

    return [{ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" }];
  }
}
