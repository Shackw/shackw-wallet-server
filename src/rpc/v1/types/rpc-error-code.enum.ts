// src/common/rpc/rpc-error-code.enum.ts

/**
 * Standard and custom error codes for JSON-RPC 2.0.
 * You can extend this enum with custom application-specific error codes.
 */
export enum RpcErrorCode {
  // JSON-RPC 2.0 Standard Errors
  /** Invalid JSON was received */
  PARSE_ERROR = -32700,
  /** JSON is not a valid Request object */
  INVALID_REQUEST = -32600,
  /** The method does not exist / is not available */
  METHOD_NOT_FOUND = -32601,
  /** Invalid method parameter(s) */
  INVALID_PARAMS = -32602,
  /** Internal JSON-RPC error */
  INTERNAL_ERROR = -32603,

  // -32000 to -32099: Reserved for implementation-defined server-errors
  /** Generic server-side error */
  SERVER_ERROR = -32000,

  // Custom Application Errors (You can customize these)
  /** Unauthorized access */
  UNAUTHORIZED = -32001,
  /** Rate limiting applied */
  RATE_LIMIT_EXCEEDED = -32002,
  /** Blockchain-specific */
  INSUFFICIENT_FUNDS = -32003,
  /** Request timeout */
  TIMEOUT = -32004
}
