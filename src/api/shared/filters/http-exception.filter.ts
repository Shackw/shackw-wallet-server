/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";

import type { Response } from "express";

type ErrorItem = { code: string; message: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toCode(raw: unknown, fallback = "HTTP_ERROR"): string {
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .trim()
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/_+/g, "_")
      .toUpperCase();
  }
  return fallback;
}

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errors = this.normalizeErrors(exception);

    Logger.log({
      statusCode: status,
      errors,
      timestamp: new Date().toISOString()
    });

    res.status(status).json({
      statusCode: status,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  private normalizeErrors(exception: unknown): ErrorItem[] {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      const baseCode = toCode(
        isRecord(payload) ? payload.error : undefined,
        toCode((exception as any)?.name ?? undefined, "HTTP_ERROR")
      );

      if (typeof payload === "string") {
        return [{ code: baseCode, message: payload }];
      }

      if (isRecord(payload)) {
        if ("message" in payload) {
          const m = payload.message;
          if (Array.isArray(m)) {
            return m.filter((x): x is string => typeof x === "string").map(msg => ({ code: baseCode, message: msg }));
          }
          if (typeof m === "string") {
            return [{ code: baseCode, message: m }];
          }
        }

        const msg =
          (typeof payload.error === "string" && payload.error) ||
          (typeof payload.message === "string" && payload.message) ||
          exception.message ||
          "Internal server error";
        return [{ code: baseCode, message: msg }];
      }

      return [{ code: baseCode, message: exception.message || "Internal server error" }];
    }

    if (exception instanceof Error) {
      return [
        {
          code: toCode(exception.name, "ERROR"),
          message: exception.message || "Internal server error"
        }
      ];
    }

    return [{ code: "HTTP_ERROR", message: "Internal server error" }];
  }
}
