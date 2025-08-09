export type JsonRpcSuccessResponse<T = any> = {
  jsonrpc: "2.0";
  result: T;
  id: number;
};

export type JsonRpcErrorResponse = {
  jsonrpc: "2.0";
  error: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | null;
};
