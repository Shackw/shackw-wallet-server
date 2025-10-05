/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/shared/interceptors/iso-date-response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function convertDatesToIso(input: unknown, seen = new WeakSet<object>()): unknown {
  if (input == null) return input;

  if (input instanceof Date) return input.toISOString();

  const t = typeof input;
  if (t !== "object") return input;

  const obj = input as object;
  if (seen.has(obj)) return input;
  seen.add(obj);

  if (typeof Buffer !== "undefined" && (Buffer as any).isBuffer?.(input)) return input;
  if (input instanceof Uint8Array) return input;

  // 配列
  if (Array.isArray(input)) {
    return input.map(v => convertDatesToIso(v, seen));
  }

  const proto = Object.getPrototypeOf(input);
  const isPlain = proto === Object.prototype || proto === null;
  if (!isPlain) return input;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    out[k] = convertDatesToIso(v, seen);
  }
  return out;
}

@Injectable()
export class DateToIsoDateStringInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => convertDatesToIso(data)));
  }
}
