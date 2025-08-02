/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { Response } from "express";

import { RpcErrorCode } from "../types/rpc-error-code.enum";
import { makeErrorResponse } from "../utils/rpc-response.util";

import {
  RpcInsufficientFundsException,
  RpcInternalErrorException,
  RpcParseError,
  RpcRateLimitExceededException,
  RpcServerErrorException,
  RpcTimeoutException,
  RpcUnauthorizedException
} from "./rpc-custom-exceptions";

@Catch()
export class RpcExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let id: number | null = null;
    let code = RpcErrorCode.INTERNAL_ERROR;
    let message = "Internal RPC Error";
    let data = undefined;

    if (exception instanceof RpcParseError) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.PARSE_ERROR;
    } else if (exception instanceof RpcInternalErrorException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.INTERNAL_ERROR;
    } else if (exception instanceof RpcServerErrorException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.SERVER_ERROR;
    } else if (exception instanceof RpcUnauthorizedException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.UNAUTHORIZED;
    } else if (exception instanceof RpcRateLimitExceededException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.RATE_LIMIT_EXCEEDED;
    } else if (exception instanceof RpcInsufficientFundsException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.INSUFFICIENT_FUNDS;
    } else if (exception instanceof RpcTimeoutException) {
      ({ id, message, data } = exception);
      code = RpcErrorCode.TIMEOUT;
    } else if (exception instanceof BadRequestException) {
      const response: any = exception.getResponse();
      const validationMessages: string[] = Array.isArray(response?.message)
        ? response.message
        : [response?.message || "Bad request"];

      const isMethodError = validationMessages.some(
        msg => typeof msg === "string" && /method(.+)?(invalid|must be)/i.test(msg)
      );

      code = isMethodError ? RpcErrorCode.METHOD_NOT_FOUND : RpcErrorCode.INVALID_PARAMS;
      message = isMethodError ? "Method not found" : `Invalid params: ${validationMessages.join(", ")}`;
    }

    response.status(200).json(makeErrorResponse(id, code, message, data));
  }
}
