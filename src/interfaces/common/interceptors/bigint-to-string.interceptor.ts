/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function bigintsToStrings(v: any): any {
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(bigintsToStrings);
  if (v && typeof v === "object" && v.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) out[k] = bigintsToStrings(val);
    return out;
  }
  return v;
}

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => bigintsToStrings(data)));
  }
}
