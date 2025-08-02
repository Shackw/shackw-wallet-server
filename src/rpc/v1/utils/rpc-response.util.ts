/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RpcErrorCode } from "../types/rpc-error-code.enum";
import { JsonRpcSuccessResponse, JsonRpcErrorResponse } from "../types/rpc-response.type";

export function makeSuccessResponse<T>(id: number, result: T): JsonRpcSuccessResponse<T> {
  return {
    jsonrpc: "2.0",
    result,
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
    message
  };

  if (data !== undefined) {
    error.data = data;
  }

  return {
    jsonrpc: "2.0",
    error,
    id
  };
}
