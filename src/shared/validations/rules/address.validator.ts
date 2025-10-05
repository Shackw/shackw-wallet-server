import * as v from "valibot";
import { Address, Hex, isAddress, zeroAddress } from "viem";

export const addressValidator = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.transform(s => s.trim()),
    v.regex(/^0x[0-9a-fA-F]{40}$/, `${field} must be a 0x-prefixed, 40-hex-character string.`),
    v.custom(
      (s: string): s is string => s.toLowerCase() !== zeroAddress,
      () => `${field} must not be the zero address.`
    ),
    v.custom(
      (s: string): s is string => isAddress(s),
      () => `${field} must be a valid EVM address.`
    ),
    v.transform(s => s as Address)
  );

export const hex32Validator = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.regex(/^0x[0-9a-fA-F]{64}$/, `${field} must be a 0x-prefixed, 64-hex-character string.`),
    v.transform((s): Hex => s as Hex)
  );
