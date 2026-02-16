import * as v from "valibot";

import { AuthorizationShape } from "@/interfaces/dto/shapes/authorization.shape";
import { NotifyShape } from "@/interfaces/dto/shapes/notify.shape";
import { chainKeyValidator } from "@/shared/validations/rules/chain.validator";
import { quoteTokenValidator } from "@/shared/validations/rules/string.validator";

// === Request Schemas ====
export const TransferTokenRequestDtoSchema = v.object(
  {
    chain: chainKeyValidator("chain"),
    quoteToken: quoteTokenValidator("quoteToken"),
    authorization: AuthorizationShape,
    notify: v.optional(NotifyShape)
  },
  issue => `${issue.expected} is required`
);

// === Response Schemas ====
export const TransferTokenResponseDtoSchema = v.object({});

// === Request DTOs ====
export type TransferTokenRequestDto = v.InferOutput<typeof TransferTokenRequestDtoSchema>;
