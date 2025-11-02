import * as v from "valibot";

import { addressValidator, hex64Validator } from "../rules/address.validator";
import { chainIdValidator } from "../rules/chain.validator";
import { bigintStringValidator } from "../rules/string-bigint.validator";

const authorizationCommonShape = {
  address: addressValidator("authorization.address"),
  chainId: chainIdValidator(),
  nonce: v.pipe(
    v.number("nonce must be a number."),
    v.integer("nonce must be an integer."),
    v.minValue(0, "nonce must be >= 0.")
  ),
  r: hex64Validator("authorization.r"),
  s: hex64Validator("authorization.r")
};

export const authorizationWithVShape = v.object(
  {
    ...authorizationCommonShape,
    v: bigintStringValidator("authorization.v"),
    yParity: v.optional(v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1."))
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, v"
);
export type AuthorizationWithV = v.InferOutput<typeof authorizationWithVShape>;

export const authorizationWithVShapeYParityShape = v.object(
  {
    ...authorizationCommonShape,
    v: v.optional(bigintStringValidator("authorization.v")),
    yParity: v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1.")
  },
  "authorization must be an object. Required fields: address, chainId, nonce, r, s, yParity"
);
export type AuthorizationWithVShapeYParity = v.InferOutput<typeof authorizationWithVShapeYParityShape>;

export type Authorization = AuthorizationWithV | AuthorizationWithVShapeYParity;
