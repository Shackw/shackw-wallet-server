import * as v from "valibot";

export const hexQty = v.pipe(v.string(), v.regex(/^0x[0-9a-fA-F]+$/, "Invalid hex quantity"));
export const hexData = v.pipe(v.string(), v.regex(/^0x([0-9a-fA-F]{2})*$/, "Invalid hex data"));
export const addr = v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"));

export const UserOperationSchema = v.object({
  sender: addr,
  nonce: hexQty,
  initCode: hexData,
  callData: hexData,
  callGasLimit: hexQty,
  verificationGasLimit: hexQty,
  preVerificationGas: hexQty,
  maxFeePerGas: hexQty,
  maxPriorityFeePerGas: hexQty,
  paymasterAndData: v.optional(hexData),
  signature: hexData
});

export const UserOperationWithoutSigSchema = v.omit(UserOperationSchema, ["signature"]);
export type UserOperation = v.InferOutput<typeof UserOperationSchema>;
