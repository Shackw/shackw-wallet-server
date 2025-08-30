/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

import type { Response } from "express";

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";

    if (exception instanceof HttpException) {
      const payload = exception.getResponse(); // string | object
      if (typeof payload === "string") {
        message = payload;
      } else if (payload && typeof payload === "object") {
        const m = (payload as any).message;
        message = Array.isArray(m) ? m.join("; ") : (m ?? exception.message ?? message);
      }
    } else if (exception && typeof exception === "object") {
      message = (exception as Error).message || message;
    }

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
