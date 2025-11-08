import * as v from "valibot";

import { addressValidator, hex64Validator } from "../rules/address.validator";
import { chainIdValidator } from "../rules/chain.validator";
import { stringBigintValidator } from "../rules/string-bigint.validator";

const AuthorizationCommonShape = {
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

export const AuthorizationShape = v.union(
  [
    v.object(
      {
        ...AuthorizationCommonShape,
        v: stringBigintValidator("authorization.v"),
        yParity: v.optional(v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1."))
      },
      "authorization must be an object. Required fields: address, chainId, nonce, r, s, v"
    ),
    v.object(
      {
        ...AuthorizationCommonShape,
        v: v.optional(stringBigintValidator("authorization.v")),
        yParity: v.union([v.literal(0), v.literal(1)], "authorization.yParity must be 0 or 1.")
      },
      "authorization must be an object. Required fields: address, chainId, nonce, r, s, yParity"
    )
  ],
  "authorization must include either 'v' or 'yParity'."
);
