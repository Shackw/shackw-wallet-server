import * as v from "valibot";
import { Address, Hex } from "viem";

const addr = v.pipe(
  v.string(),
  v.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
  v.transform(s => s as Address)
);
const hexQty = v.pipe(
  v.string(),
  v.regex(/^0x([0-9a-fA-F]{2})*$/, "Invalid hex data"),
  v.transform(s => s as Hex)
);
const sigHex = v.pipe(
  v.string(),
  v.regex(/^0x[0-9a-fA-F]{130}$/, "Invalid 65-byte signature"),
  v.transform(s => s as Hex)
);
const bigIntish = v.pipe(
  v.string(),
  v.regex(/^0x[0-9a-fA-F]+$|^[0-9]+$/, "amount must be decimal or 0x-hex"),
  v.transform(s => (s.startsWith("0x") ? BigInt(s) : BigInt(s)))
);

export const JsonrpcBaseSchema = {
  jsonrpc: v.literal("2.0"),
  id: v.pipe(v.number(), v.integer())
};

export const PaymasterKindSchema = v.union([v.literal("JPYS"), v.literal("USDC"), v.literal("EURC")]);

export const UserOperationBaseSchema = {
  sender: addr,
  nonce: bigIntish,
  initCode: hexQty,
  callData: hexQty,
  callGasLimit: bigIntish,
  verificationGasLimit: bigIntish,
  preVerificationGas: bigIntish,
  maxFeePerGas: bigIntish,
  maxPriorityFeePerGas: bigIntish,
  paymasterAndData: v.pipe(
    v.undefinedable(hexQty),
    v.transform(val => val ?? ("0x" as Hex))
  ),
  signature: v.pipe(
    v.undefinedable(hexQty),
    v.transform(val => val ?? ("0x" as Hex))
  )
};

export const UserOperationBaseObjectSchema = v.object(UserOperationBaseSchema);

export const CommonParamsSchema = {
  entryPoint: addr,
  amount: bigIntish,
  validAfter: v.pipe(v.number(), v.integer(), v.minValue(0)),
  validUntil: v.pipe(v.number(), v.integer(), v.minValue(0)),
  paymasterKind: PaymasterKindSchema
};

export const SendUserOperationPramSchema = v.object({
  ...CommonParamsSchema,
  userOperation: v.object({
    ...UserOperationBaseSchema,
    paymasterAndData: hexQty,
    signature: sigHex
  })
});

export const PreparePaymasterAndDataPramSchema = v.object({
  ...CommonParamsSchema,
  userOperation: v.object({ ...UserOperationBaseSchema })
});

export const RpcSchema = v.variant("method", [
  v.object({
    ...JsonrpcBaseSchema,
    method: v.literal("eth_sendUserOperation"),
    params: v.tuple([SendUserOperationPramSchema])
  }),
  v.object({
    ...JsonrpcBaseSchema,
    method: v.literal("pm_preparePaymasterAndData"),
    params: v.tuple([PreparePaymasterAndDataPramSchema])
  })
]);
