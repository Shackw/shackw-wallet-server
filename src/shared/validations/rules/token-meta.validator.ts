import * as v from "valibot";

import { TOKENS } from "@/registries/token.registry";

import { addressValidator } from "./address.validator";

export const tokenMetaValidator = v.object({
  symbol: v.pipe(v.string(), v.picklist(TOKENS)),
  address: addressValidator(),

  decimals: v.number()
});
