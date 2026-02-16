import type { ApplicationErrorCode } from "./application-error.code";

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly httpStatus: number;

  constructor(params: { code: ApplicationErrorCode; message?: string; httpStatus?: number; cause?: unknown }) {
    super(params.message ?? params.code);
    this.name = "ApplicationError";
    this.code = params.code;
    this.httpStatus = params.httpStatus ?? 400;
    this.cause = params.cause;
  }
}

export function isApplicationError(e: unknown): e is ApplicationError {
  return e instanceof ApplicationError;
}
