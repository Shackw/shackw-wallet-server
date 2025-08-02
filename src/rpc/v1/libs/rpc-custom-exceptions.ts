/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class RpcParseError extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Parse error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcParseError";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcInvalidRequestException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Invalid request${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInvalidRequestException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcInternalErrorException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Internal error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInternalErrorException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcServerErrorException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Server error${detail ? `: ${detail}` : ""}`);
    this.name = "RpcServerErrorException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcUnauthorizedException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Unauthorized${detail ? `: ${detail}` : ""}`);
    this.name = "RpcUnauthorizedException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcRateLimitExceededException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Rate limit exceeded${detail ? `: ${detail}` : ""}`);
    this.name = "RpcRateLimitExceededException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcInsufficientFundsException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Insufficient funds${detail ? `: ${detail}` : ""}`);
    this.name = "RpcInsufficientFundsException";
    this.id = chainId;
    this.data = data;
  }
}

export class RpcTimeoutException extends Error {
  public readonly id: number;
  public readonly data?: any;

  constructor(chainId: number, detail?: string, data?: any) {
    super(`Timeout${detail ? `: ${detail}` : ""}`);
    this.name = "RpcTimeoutException";
    this.id = chainId;
    this.data = data;
  }
}
