import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type Wrapped<T> = { data: T; meta?: Record<string, unknown> };

@Injectable()
export class WrapDataInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<Wrapped<unknown>> {
    return next.handle().pipe(
      map((value: unknown): Wrapped<unknown> => {
        if (Array.isArray(value))
          return {
            data: value,
            meta: { count: value.length }
          };

        return { data: value };
      })
    );
  }
}
