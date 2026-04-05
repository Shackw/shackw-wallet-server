import * as v from "valibot";

import { CHAIN_KEYS } from "@/domain/constants/chain.constant";
import { TOKENS } from "@/domain/constants/token.constant";
import { FeePolicyShape } from "@/interfaces/common/shapes/fee-policy.shape";
import { TokenAmountShape } from "@/interfaces/common/shapes/token-amount.shape";
import { TokenDescriptorShape } from "@/interfaces/common/shapes/token-descriptor.shape";
import { stringBigintValidator } from "@/shared/validations/rules/string.validator";

// === Request Schemas ====
export const EstimateFeeRequestDtoSchema = v.object(
  {
    chain: v.picklist(CHAIN_KEYS, `chain must be one of ${CHAIN_KEYS.join("/")}`),
    token: v.object({ symbol: v.picklist(TOKENS, `token must be one of ${TOKENS.join("/")}`) }),
    feeToken: v.object({ symbol: v.picklist(TOKENS, `feeToken must be one of ${TOKENS.join("/")}`) }),
    amountMinUnits: stringBigintValidator("amountMinUnits")
  },
  issue => `${issue.expected} is required`
);

// === Response Schemas ====
export const EstimateFeeResponseDtoSchema = v.object({
  token: TokenDescriptorShape,
  feeToken: TokenDescriptorShape,
  amount: TokenAmountShape,
  fee: TokenAmountShape,
  policy: FeePolicyShape
});

// === Request DTOs ====
export type EstimateFeeRequestDto = v.InferOutput<typeof EstimateFeeRequestDtoSchema>;

// === Response DTOs ====
export type EstimateFeeResponseDto = v.InferOutput<typeof EstimateFeeResponseDtoSchema>;
