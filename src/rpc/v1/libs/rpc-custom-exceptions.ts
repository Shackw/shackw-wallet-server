/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class RpcParseError extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Parse error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcParseError";
    this.data = data;
  }
}

export class RpcInvalidRequestException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Invalid request${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInvalidRequestException";
    this.data = data;
  }
}

export class RpcInternalErrorException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Internal error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInternalErrorException";
    this.data = data;
  }
}

export class RpcServerErrorException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Server error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcServerErrorException";
    this.data = data;
  }
}

export class RpcUnauthorizedException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Unauthorized${detail ? `: ${detail}` : ""}`);
    this.name = "RpcUnauthorizedException";
    this.data = data;
  }
}

export class RpcInsufficientFundsException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Insufficient funds${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInsufficientFundsException";
    this.data = data;
  }
}

export class RpcTimeoutException extends Error {
  public readonly data?: any;

  constructor(detail?: string, data?: any) {
    super(`Timeout${detail ? `: ${detail}` : ""}`);
    this.name = "RpcTimeoutException";
    this.data = data;
  }
}
