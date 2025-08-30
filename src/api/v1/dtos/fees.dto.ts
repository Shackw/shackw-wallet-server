import * as v from "valibot";

import { DEFAULT_CHAIN } from "@/configs/chain.config";
import { TOKENS } from "@/registries/token.registry";
import { strToBigintValidator } from "@/validations/rules/str-to-bigint.validator";

export const EstimateFeeDtoSchema = v.object({
  chainId: v.pipe(v.number(), v.literal(DEFAULT_CHAIN.id)),
  amountMinUnits: strToBigintValidator,
  token: v.object({ symbol: v.pipe(v.string(), v.picklist(TOKENS)) }),
  feeToken: v.object({ symbol: v.pipe(v.string(), v.picklist(TOKENS)) })
});
export type EstimateFeeDto = v.InferOutput<typeof EstimateFeeDtoSchema>;
