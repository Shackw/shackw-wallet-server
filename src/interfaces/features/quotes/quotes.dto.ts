import * as v from "valibot";

import { CHAIN_KEYS } from "@/config/chain.config";
import { TOKENS } from "@/config/token.config";
import { FeePolicyShape } from "@/interfaces/common/shapes/fee-policy.shape";
import { TokenAmountShape } from "@/interfaces/common/shapes/token-amount.shape";
import { TokenDescriptorShape } from "@/interfaces/common/shapes/token-descriptor.shape";
import { addressValidator, hex64Validator } from "@/shared/validations/rules/address.validator";
import { stringBigintValidator, quoteTokenValidator } from "@/shared/validations/rules/string.validator";

// === Request Schemas ====
export const CreateQuoteRequestDtoSchema = v.object(
  {
    chain: v.picklist(CHAIN_KEYS, `chain must be one of ${CHAIN_KEYS.join("/")}`),
    sender: addressValidator("sender"),
    recipient: addressValidator("recipient"),
    token: v.object({ symbol: v.picklist(TOKENS, `token must be one of ${TOKENS.join("/")}`) }),
    feeToken: v.object({ symbol: v.picklist(TOKENS, `feeToken must be one of ${TOKENS.join("/")}`) }),
    amountMinUnits: stringBigintValidator("amountMinUnits")
  },
  issue => `${issue.expected} is required`
);

// === Response Schemas ====
export const CreateQuoteResponseDtoSchemas = v.object({
  nonce: v.bigint(),
  quoteToken: quoteTokenValidator(),
  expiresAt: v.date(),
  serverTime: v.date(),
  chainId: v.number(),
  delegate: addressValidator("delegate"),
  sponsor: addressValidator("sponsor"),
  sender: addressValidator("sender"),
  recipient: addressValidator("recipient"),
  token: TokenDescriptorShape,
  feeToken: TokenDescriptorShape,
  amount: TokenAmountShape,
  fee: TokenAmountShape,
  policy: FeePolicyShape,
  callHash: hex64Validator("callHash")
});

// === Request DTOs ====
export type CreateQuoteRequestDto = v.InferOutput<typeof CreateQuoteRequestDtoSchema>;

// === Response DTOs ====
export type CreateQuoteResponseDto = v.InferOutput<typeof CreateQuoteResponseDtoSchemas>;
