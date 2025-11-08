/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class WrapArrayInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const limit = req?.query?.limit ? Number(req.query.limit) : undefined;
    const offset = req?.query?.offset ? Number(req.query.offset) : undefined;

    return next.handle().pipe(
      map(data => {
        if (!Array.isArray(data)) return data;
        return {
          items: data,
          count: data.length,
          ...(limit !== undefined ? { limit } : {}),
          ...(offset !== undefined ? { offset } : {})
        };
      })
    );
  }
}
