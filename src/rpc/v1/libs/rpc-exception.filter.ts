/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost, PayloadTooLargeException } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Response } from "express";
import { ValiError } from "valibot";
import * as v from "valibot";

import { RpcSchema } from "../schema/rpc.schema";
import { RpcErrorCode } from "../types/rpc-error-code.enum";
import { makeErrorResponse } from "../utils/rpc-response.util";

import {
  RpcInsufficientFundsException,
  RpcInternalErrorException,
  RpcParseError,
  RpcServerErrorException,
  RpcTimeoutException,
  RpcUnauthorizedException
} from "./rpc-custom-exceptions";

@Catch()
export class RpcExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const reqBody: any = req.body;

    const id: number | null = reqBody.id ?? null;
    let code = RpcErrorCode.INTERNAL_ERROR;
    let message = "Internal RPC Error";
    let data = undefined;

    if (exception instanceof RpcParseError) {
      ({ message, data } = exception);
      code = RpcErrorCode.PARSE_ERROR;
    } else if (exception instanceof RpcInternalErrorException) {
      ({ message, data } = exception);
      code = RpcErrorCode.INTERNAL_ERROR;
    } else if (exception instanceof RpcServerErrorException) {
      ({ message, data } = exception);
      code = RpcErrorCode.SERVER_ERROR;
    } else if (exception instanceof RpcUnauthorizedException) {
      ({ message, data } = exception);
      code = RpcErrorCode.UNAUTHORIZED;
    } else if (exception instanceof RpcInsufficientFundsException) {
      ({ message, data } = exception);
      code = RpcErrorCode.INSUFFICIENT_FUNDS;
    } else if (exception instanceof RpcTimeoutException) {
      ({ message, data } = exception);
      code = RpcErrorCode.TIMEOUT;
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
      message = isMethodError ? "Method not found" : `Invalid params: ${(issues.root ?? []).join(", ")}`;
    }

    res.status(200).json(makeErrorResponse(id, code, message, data));
  }
}
