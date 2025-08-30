import * as v from "valibot";

import { privateKeyValidator, addressValidator } from "../rules/address.validator";

export const EnvSchema = v.object({
  NODE_ENV: v.union([v.literal("dev"), v.literal("prd")]),
  SPONSOR_PK: v.pipe(v.string(), privateKeyValidator),
  JPYC_TOKEN_ADDRESS: v.pipe(v.string(), addressValidator()),
  USDC_TOKEN_ADDRESS: v.pipe(v.string(), addressValidator()),
  EURC_TOKEN_ADDRESS: v.pipe(v.string(), addressValidator()),
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
