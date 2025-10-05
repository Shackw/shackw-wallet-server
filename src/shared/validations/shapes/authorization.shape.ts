import * as v from "valibot";

import { addressValidator, hex32Validator } from "@/validations/rules/address.validator";
import { chainIdValidator } from "@/validations/rules/chain-id.validator";
import { unsignedBigintFromStringValidator } from "@/validations/rules/unsigned-bigint-from-string.validator";

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

export const authorizationWithVShape = v.object(
  {
    ...authorizationCommonShape,
    v: unsignedBigintFromStringValidator("authorization.v"),
    yParity: v.optional(v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1."))
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, v"
);
export type AuthorizationWithV = v.InferOutput<typeof authorizationWithVShape>;

export const authorizationWithVShapeYParityShape = v.object(
  {
    ...authorizationCommonShape,
    v: v.optional(unsignedBigintFromStringValidator("authorization.v")),
    yParity: v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1.")
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, yParity"
);
export type AuthorizationWithVShapeYParity = v.InferOutput<typeof authorizationWithVShapeYParityShape>;

export type Authorization = AuthorizationWithV | AuthorizationWithVShapeYParity;
