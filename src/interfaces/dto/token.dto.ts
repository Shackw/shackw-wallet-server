import * as v from "valibot";

import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { AuthorizationShape } from "@/shared/validations/shapes/authorization.shape";
import { NotifyShape } from "@/shared/validations/shapes/notify.shape";
import { QuoteTokenShape } from "@/shared/validations/shapes/quote-token.shape";

export const TransferTokenDtoSchema = v.object(
  {
    chain: chainValidator("chain"),
    quoteToken: QuoteTokenShape,
    authorization: AuthorizationShape,
    notify: v.optional(NotifyShape)
  },
  issue => `${issue.expected} is required`
);
export type TransferTokenRequestDto = v.InferOutput<typeof TransferTokenDtoSchema>;
