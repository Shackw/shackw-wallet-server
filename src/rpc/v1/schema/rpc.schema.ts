import * as v from "valibot";

import { addr, UserOperationSchema } from "./user-operation.schema";

const jsonrpcBase = {
  jsonrpc: v.literal("2.0"),
  id: v.pipe(v.number(), v.integer())
};

const SendUserOperationParams = v.tuple([
  v.object({
    userOperation: UserOperationSchema,
    entryPoint: addr,
    amount: v.bigint(),
    validAfter: v.number(),
    validUntil: v.number()
  })
]);

const GetPaymasterAndDataParams = v.tuple([
  v.object({
    userOperation: UserOperationSchema,
    entryPoint: addr,
    amount: v.bigint(),
    validAfter: v.number(),
    validUntil: v.number()
  })
]);

export const RpcSchema = v.variant("method", [
  v.object({
    ...jsonrpcBase,
    method: v.literal("eth_sendUserOperation"),
    params: SendUserOperationParams
  }),
  v.object({
    ...jsonrpcBase,
    method: v.literal("pm_preparePaymasterAndData"),
    params: GetPaymasterAndDataParams
  })
]);

export type RpcRequest = v.InferOutput<typeof RpcSchema>;
export type RpcRequestMethods = RpcRequest["method"];
