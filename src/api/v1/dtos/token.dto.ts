import * as v from "valibot";

import { authorizationWithVShape, authorizationWithVShapeYParityShape } from "@/validations/shapes/authorization.shape";
import { notifyShape } from "@/validations/shapes/notify.shape";
import { quoteTokenShape } from "@/validations/shapes/quote-token.shape";

export const TransferTokenDtoSchema = v.object(
  {
    quoteToken: quoteTokenShape,
    authorization: v.union(
      [authorizationWithVShape, authorizationWithVShapeYParityShape],
      "authorization must include either 'v' or 'yParity'."
    ),
    notify: v.optional(notifyShape)
  },
  issue => `${issue.expected} is required`
);
export type TransferTokenDto = v.InferOutput<typeof TransferTokenDtoSchema>;
