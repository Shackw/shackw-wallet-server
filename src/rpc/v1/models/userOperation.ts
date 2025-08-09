import { RpcRequest } from "../schema/rpc.schema";

export type PrepareUserOperationInput = Extract<RpcRequest, { method: "pm_preparePaymasterAndData" }>["params"]["0"];

export type PrepareUserOperationModel = {
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
  validAfter: number;
  validUntil: number;
};

export type SendUserOperationInput = Extract<RpcRequest, { method: "eth_sendUserOperation" }>["params"]["0"];

export type SendUserOperationModel = { userOpHash: `0x${string}`; requestId?: `0x${string}` };
