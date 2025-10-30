import * as v from "valibot";
import { Address } from "viem";

import { TOKENS } from "@/registries/token.registry";
import { feePolicyShape } from "@/validations/shapes/fee-policy.shape";

export const FeeModelSchema = v.object({
  token: v.object({
    symbol: v.picklist(TOKENS),
    address: v.pipe(
      v.string(),
      v.transform(s => s as Address)
    ),
    decimals: v.number()
  }),
  feeToken: v.object({
    symbol: v.picklist(TOKENS),
    address: v.pipe(
      v.string(),
      v.transform(s => s as Address)
    ),
    decimals: v.number()
  }),
  feeMinUnits: v.bigint(),
  feeDecimals: v.number(),
  policy: feePolicyShape
});
export type FeeModel = v.InferInput<typeof FeeModelSchema>;
