/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost, PayloadTooLargeException, Logger } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Response } from "express";
import { ValiError } from "valibot";
import * as v from "valibot";

import { RpcSchema } from "../../rpc/v1/schema/rpc.schema";
import {
  RpcInsufficientFundsException,
  RpcInternalErrorException,
  RpcInvalidRequestException,
  RpcParseError,
  RpcServerErrorException,
  RpcTimeoutException,
  RpcUnauthorizedException
} from "../jsonrpc/exceptions";
import { makeErrorResponse } from "../jsonrpc/response";
import { RpcErrorCode } from "../jsonrpc/types";

@Catch()
export class RpcExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const reqBody: any = req.body;

    const id: number | null = reqBody?.id ?? null;
    let code = RpcErrorCode.INTERNAL_ERROR;
    let message = "Internal RPC Error";
    let data: any = undefined;

    if (exception instanceof RpcParseError) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcInvalidRequestException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcInternalErrorException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcServerErrorException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcUnauthorizedException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcInsufficientFundsException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof RpcTimeoutException) {
      ({ message, data, code } = exception);
    } else if (exception instanceof ThrottlerException) {
      code = RpcErrorCode.RATE_LIMIT_EXCEEDED;
      message = "Rate limit exceeded";
    } else if (exception instanceof PayloadTooLargeException) {
      code = RpcErrorCode.INVALID_PARAMS;
      message = "Payload too large";
    } else if (exception instanceof ValiError) {
      const issues = v.flatten<typeof RpcSchema>(exception.issues);
      const isMethodError = Object.keys(issues.nested ?? {}).includes("method");
      code = isMethodError ? RpcErrorCode.METHOD_NOT_FOUND : RpcErrorCode.INVALID_PARAMS;
      message = isMethodError ? "Method not found" : "Invalid params";
      data = issues.nested;
    }

    Logger.error(
      {
        code,
        message,
        exception: {
          name: (exception as any)?.name,
          message: (exception as any)?.message,
          stack: (exception as any)?.stack
        },
        rpc: {
          id,
          method: reqBody?.method,
          params: reqBody?.params
        }
      },
      "RpcExceptionsFilter"
    );

    res.status(200).json(makeErrorResponse(id, code, message, data));
  }
}
