import * as v from "valibot";

import { EnvSchema } from "../validations/schemas/env.schema";

export type Env = v.InferOutput<typeof EnvSchema>;

export const ENV: Env = v.parse(EnvSchema, {
  NODE_ENV: process.env.NODE_ENV,
  SPONSOR_ADDRESS: process.env.SPONSOR_ADDRESS,
  SPONSOR_PK: process.env.SPONSOR_PK,
  DELEGATE_ADDRESS: process.env.DELEGATE_ADDRESS,
  REGISTRY_ADDRESS: process.env.REGISTRY_ADDRESS,
  QUOTE_TOKEN_SECRET: process.env.QUOTE_TOKEN_SECRET,
  JPYC_TOKEN_ADDRESS: process.env.JPYC_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS: process.env.USDC_TOKEN_ADDRESS,
  EURC_TOKEN_ADDRESS: process.env.EURC_TOKEN_ADDRESS,
  FEE_BPS: process.env.FEE_BPS,
  JPYC_FEE_CAP_UNITS: process.env.JPYC_FEE_CAP_UNITS,
  USDC_FEE_CAP_UNITS: process.env.USDC_FEE_CAP_UNITS,
  EURC_FEE_CAP_UNITS: process.env.EURC_FEE_CAP_UNITS
});
