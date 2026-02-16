/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type Wrapped<T> = { data: T; meta?: Record<string, unknown> };

@Injectable()
export class WrapDataInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const limit = req?.query?.limit ? Number(req.query.limit) : undefined;
    const offset = req?.query?.offset ? Number(req.query.offset) : undefined;

    return next.handle().pipe(
      map((value): Wrapped<any> | any => {
        if (value && typeof value === "object" && "data" in value) return value;

        if (Array.isArray(value)) {
          return {
            data: value,
            meta: {
              count: value.length,
              ...(limit !== undefined ? { limit } : {}),
              ...(offset !== undefined ? { offset } : {})
            }
          };
        }

        return { data: value ?? null };
      })
    );
  }
}
