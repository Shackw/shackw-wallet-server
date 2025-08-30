import * as v from "valibot";

import { TOKENS } from "@/configs/token.config";

import { strToBigintValidator } from "./str-to-bigint.validator";

export const feesPolicyValidator = v.object({
  method: v.string(),
  version: v.string(),
  bps: v.number(),
  cap: v.object({
    minUnit: strToBigintValidator,
    currency: v.pipe(v.string(), v.picklist(TOKENS))
  })
});
