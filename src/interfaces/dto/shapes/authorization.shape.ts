import * as v from "valibot";

import { stringBigintValidator } from "@/shared/validations/rules/string.validator";

import { addressValidator, hex64Validator } from "../../../shared/validations/rules/address.validator";

const AuthorizationCommonShape = {
  address: addressValidator("authorization.address"),
  chainId: v.number("chainId must be a number."),
  nonce: v.pipe(
    v.number("nonce must be a number."),
    v.integer("nonce must be an integer."),
    v.minValue(0, "nonce must be >= 0.")
  ),
  r: hex64Validator("authorization.r"),
  s: hex64Validator("authorization.s")
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
