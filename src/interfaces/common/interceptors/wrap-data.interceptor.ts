/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type Wrapped<T> = { data: T; meta?: Record<string, unknown> };

@Injectable()
export class WrapDataInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value): Wrapped<any> | any => {
        if (Array.isArray(value))
          return {
            data: value,
            meta: {
              count: value.length
            }
          };

        return { data: value };
      })
    );
  }
}
