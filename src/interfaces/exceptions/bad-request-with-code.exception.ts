import { BadRequestException, type HttpExceptionOptions } from "@nestjs/common";

export class BadRequestWithCodeException extends BadRequestException {
  constructor(code: string, message?: string | Record<string, unknown>, options?: HttpExceptionOptions) {
    const body =
      message && typeof message === "object"
        ? { ...message, error: code }
        : { message: message ?? "Bad Request", error: code };

    super(body, options);
    this.name = code;
  }
}
