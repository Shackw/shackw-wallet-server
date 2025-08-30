import * as v from "valibot";

import { EnvSchema } from "../validations/schemas/env.schema";

export type EnvModel = v.InferOutput<typeof EnvSchema>;
export type BuildEnv = EnvModel["NODE_ENV"];

export const ENV: EnvModel = v.parse(EnvSchema, {
  NODE_ENV: process.env.NODE_ENV,
  SPONSOR_PK: process.env.SPONSOR_PK,
  JPYC_TOKEN_ADDRESS: process.env.JPYC_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS: process.env.USDC_TOKEN_ADDRESS,
  EURC_TOKEN_ADDRESS: process.env.EURC_TOKEN_ADDRESS,
  FEE_BPS: process.env.FEE_BPS,
  JPYC_FEE_CAP_UNITS: process.env.JPYC_FEE_CAP_UNITS,
  USDC_FEE_CAP_UNITS: process.env.USDC_FEE_CAP_UNITS,
  EURC_FEE_CAP_UNITS: process.env.EURC_FEE_CAP_UNITS
});

export const { NODE_ENV } = ENV;
