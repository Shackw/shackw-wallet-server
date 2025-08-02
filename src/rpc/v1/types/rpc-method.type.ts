export const RpcMethods = ["eth_sendUserOperation"] as const;
export type RpcMethod = (typeof RpcMethods)[number];
