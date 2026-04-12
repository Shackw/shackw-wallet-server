import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { Observable, tap } from "rxjs";

import { CustomLogger } from "@/shared/custom-logger";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, query, params } = req;
    const body: unknown = req.body;

    const now = dayjs();

    return next.handle().pipe(
      tap(responseBody => {
        const res = context.switchToHttp().getResponse<Response>();
        this.logger.log(
          {
            method,
            url,
            request: {
              ...(Object.keys(query).length ? { query } : {}),
              ...(Object.keys(params).length ? { params } : {}),
              body
            },
            response: {
              statusCode: res.statusCode,
              body: responseBody
            },
            durationMs: dayjs().diff(now)
          },
          LoggingInterceptor.name
        );
      })
    );
  }
}
