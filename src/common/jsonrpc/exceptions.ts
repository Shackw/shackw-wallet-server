/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RpcErrorCode } from "./types";

abstract class RpcException extends Error {
  constructor(
    public readonly code: RpcErrorCode,
    msg: string,
    public readonly data?: unknown
  ) {
    super(msg);
    this.name = new.target.name;
  }
}

export class RpcParseError extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.PARSE_ERROR, `Parse error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcParseError";
    this.data = data;
  }
}

export class RpcInvalidRequestException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.INVALID_REQUEST, `Invalid request${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInvalidRequestException";
    this.data = data;
  }
}

export class RpcInternalErrorException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.INTERNAL_ERROR, `Internal error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInternalErrorException";
    this.data = data;
  }
}

export class RpcServerErrorException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.SERVER_ERROR, `Server error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcServerErrorException";
    this.data = data;
  }
}

export class RpcUnauthorizedException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.UNAUTHORIZED, `Unauthorized${detail ? `: ${detail}` : ""}`);
    this.name = "RpcUnauthorizedException";
    this.data = data;
  }
}

export class RpcInsufficientFundsException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.INSUFFICIENT_FUNDS, `Insufficient funds${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInsufficientFundsException";
    this.data = data;
  }
}

export class RpcTimeoutException extends RpcException {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(RpcErrorCode.TIMEOUT, `Timeout${detail ? `: ${detail}` : ""}`);
    this.name = "RpcTimeoutException";
    this.data = data;
  }
}
