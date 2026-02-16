import * as v from "valibot";

import { addressValidator } from "@/shared/validations/rules/address.validator";
import { tokenSymbolValidator } from "@/shared/validations/rules/token.validator";

export const TokenDescriptorShape = v.object({
  symbol: tokenSymbolValidator(),
  address: addressValidator("address"),
  decimals: v.number()
});
