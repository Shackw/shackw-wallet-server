import * as v from "valibot";

import { AuthorizationShape } from "@/interfaces/common/shapes/authorization.shape";
import { hex64Validator } from "@/shared/validations/rules/address.validator";
import { chainKeyValidator } from "@/shared/validations/rules/chain.validator";
import { quoteTokenValidator } from "@/shared/validations/rules/string.validator";

// === Request Schemas ====
export const TransferTokenRequestDtoSchema = v.object(
  {
    chain: chainKeyValidator("chain"),
    quoteToken: quoteTokenValidator("quoteToken"),
    authorization: AuthorizationShape
  },
  issue => `${issue.expected} is required`
);

// === Response Schemas ====
export const TransferTokenResponseDtoSchema = v.object({
  status: v.literal("submitted"),
  txHash: hex64Validator("txHash")
});

// === Request DTOs ====
export type TransferTokenRequestDto = v.InferOutput<typeof TransferTokenRequestDtoSchema>;

// === Response DTOs ====
export type TransferTokenResponseDto = v.InferOutput<typeof TransferTokenResponseDtoSchema>;
