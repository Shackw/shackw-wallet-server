import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

function bigintsToStrings(v: unknown): JsonValue {
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(bigintsToStrings);
  if (v !== null && typeof v === "object" && v.constructor === Object) {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, bigintsToStrings(val)])
    );
  }
  return v as JsonPrimitive;
}

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<JsonValue> {
    return next.handle().pipe(map((data: unknown) => bigintsToStrings(data)));
  }
}
