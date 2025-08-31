import * as v from "valibot";

import { addressValidator, hex32Validator } from "@/validations/rules/address.validator";
import { chainIdValidator } from "@/validations/rules/chain-id.validator";
import { unsignedBigintFromStringValidator } from "@/validations/rules/unsigned-bigint-from-string.validator";

const quoteTokenShape = v.pipe(
  v.string("quoteToken must be a string."),
  v.minLength(1, "quoteToken must not be empty."),
  v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, "quoteToken must be base64url 'payload.mac' format.")
);

const authorizationCommonShape = {
  address: addressValidator("authorization.address"),
  chainId: chainIdValidator(),
  nonce: v.pipe(
    v.number("nonce must be a number."),
    v.integer("nonce must be an integer."),
    v.minValue(0, "nonce must be >= 0.")
  ),
  r: hex32Validator("authorization.r"),
  s: hex32Validator("authorization.r")
};

const authorizationWithVShape = v.object(
  {
    ...authorizationCommonShape,
    v: unsignedBigintFromStringValidator("authorization.v"),
    yParity: v.optional(v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1."))
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, v"
);

const authorizationWithVShapeYParityShape = v.object(
  {
    ...authorizationCommonShape,
    v: v.optional(unsignedBigintFromStringValidator("authorization.v")),
    yParity: v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1.")
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, yParity"
);

export const TransferTokenDtoSchema = v.object(
  {
    quoteToken: quoteTokenShape,
    authorization: v.union(
      [authorizationWithVShape, authorizationWithVShapeYParityShape],
      "authorization must include either 'v' or 'yParity'."
    )
  },
  issue => `${issue.expected} is required`
);
export type TransferTokenDto = v.InferOutput<typeof TransferTokenDtoSchema>;
