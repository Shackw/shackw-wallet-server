import * as v from "valibot";

import { TOKENS } from "@/configs/token.config";

import { addressValidator } from "./address.validator";

export const tokenMetaValidator = v.object({
  symbol: v.pipe(v.string(), v.picklist(TOKENS)),
  address: addressValidator(),

  decimals: v.number()
});
