import * as v from "valibot";

import { hex32Validator, addressValidator } from "../rules/address.validator";

export const EnvSchema = v.object({
  NODE_ENV: v.union([v.literal("dev"), v.literal("prd")]),
  SPONSOR_ADDRESS: addressValidator("SPONSOR_ADDRESS"),
  SPONSOR_PK: hex32Validator("SPONSOR_PK"),
  DELEGATE_ADDRESS: addressValidator("DELEGATE_ADDRESS"),
  QUOTE_TOKEN_SECRET: hex32Validator("QUOTE_TOKEN_SECRET"),
  JPYC_TOKEN_ADDRESS: addressValidator("JPYC_TOKEN_ADDRESS"),
  USDC_TOKEN_ADDRESS: addressValidator("USDC_TOKEN_ADDRESS"),
  EURC_TOKEN_ADDRESS: addressValidator("EURC_TOKEN_ADDRESS"),
  FEE_BPS: v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(),
    v.minValue(0),
    v.maxValue(1000)
  ),
  JPYC_FEE_CAP_UNITS: v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(),
    v.minValue(0),
    v.maxValue(500)
  ),
  USDC_FEE_CAP_UNITS: v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(),
    v.minValue(0),
    v.maxValue(5)
  ),
  EURC_FEE_CAP_UNITS: v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(),
    v.minValue(0),
    v.maxValue(4.5)
  )
});
