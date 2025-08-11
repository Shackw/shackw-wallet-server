import * as v from "valibot";
import { Hex } from "viem";

import {
  PaymasterKindSchema,
  PreparePaymasterAndDataPramSchema,
  SendUserOperationPramSchema,
  UserOperationBaseObjectSchema
} from "../schema/rpc.schema";

export type PaymasterKind = v.InferOutput<typeof PaymasterKindSchema>;

export type UserOperationModel = v.InferOutput<typeof UserOperationBaseObjectSchema>;

export type PreparePaymasterAndDataInput = v.InferOutput<typeof PreparePaymasterAndDataPramSchema>;

export type PreparePaymasterAndDataModel = {
  paymasterAndData: Hex;
  signature: Hex;
  validAfter: number;
  validUntil: number;
  quotedFee: bigint;
};

export type SendUserOperationInput = v.InferOutput<typeof SendUserOperationPramSchema>;

export type SendUserOperationModel = { userOpHash: Hex; requestId?: Hex };
