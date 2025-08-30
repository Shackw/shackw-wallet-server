import * as v from "valibot";
import { Address, isAddress } from "viem";

export const addressValidator = (errorMes: string = "Invalid address") =>
  v.pipe(
    v.string(),
    v.custom<string>(
      (value): value is string => typeof value === "string" && isAddress(value),
      () => errorMes
    ),
    v.transform(s => s as Address)
  );

export const privateKeyValidator = v.pipe(
  v.custom<string>(
    (value): value is string => typeof value === "string" && /^0x[0-9a-fA-F]{64}$/.test(value),
    () => "Invalid Ethereum private key"
  ),
  v.transform(s => s as Address)
);
