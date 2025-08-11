/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JsonRpcSuccessResponse, JsonRpcErrorResponse, RpcErrorCode } from "./types";

const toJSONSafe = (v: any): any => {
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(toJSONSafe);
  if (v && typeof v === "object") {
    const out: any = {};
    for (const [k, val] of Object.entries(v)) out[k] = toJSONSafe(val);
    return out;
  }
  return v;
};

export function makeSuccessResponse<T>(id: number, result: T): JsonRpcSuccessResponse<unknown> {
  return {
    jsonrpc: "2.0",
    result: toJSONSafe(result),
    id
  };
}

export function makeErrorResponse(
  id: number | null,
  code: RpcErrorCode,
  message: string,
  data?: any
): JsonRpcErrorResponse {
  const error: JsonRpcErrorResponse["error"] = {
    code,
    message,
    ...(data !== undefined ? { data: toJSONSafe(data) } : {})
  };

  return {
    jsonrpc: "2.0",
    error,
    id
  };
}
