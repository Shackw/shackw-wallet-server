import * as v from "valibot";

import { tokenSymbolValidator } from "@/shared/validations/rules/token.validator";

export const TokenAmountShape = v.object({
  symbol: tokenSymbolValidator(),
  minUnits: v.bigint(),
  decimals: v.number()
});
