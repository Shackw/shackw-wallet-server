import * as v from "valibot";

import { hex32Validator, addressValidator, hex64Validator } from "../rules/address.validator";
import {
  feeBpsValidator,
  jpycFeeCapUnitValidator,
  usdcFeeCapUnitValidator,
  eurcFeeCapUnitValidator
} from "../rules/fee-setting.validator";

export const EnvSchema = v.object({
  NODE_ENV: v.union([v.literal("dev"), v.literal("prd")]),

  RPC_INFURA_ID: hex32Validator("RPC_INFURA_ID"),

  SPONSOR_ADDRESS: addressValidator("SPONSOR_ADDRESS"),
  SPONSOR_PK: hex64Validator("SPONSOR_PK"),

  QUOTE_TOKEN_SECRET: hex64Validator("QUOTE_TOKEN_SECRET"),

  MAIN_JPYC_TOKEN_ADDRESS: addressValidator("MAIN_JPYC_TOKEN_ADDRESS"),
  MAIN_USDC_TOKEN_ADDRESS: addressValidator("MAIN_USDC_TOKEN_ADDRESS"),
  MAIN_EURC_TOKEN_ADDRESS: addressValidator("MAIN_EURC_TOKEN_ADDRESS"),

  MAIN_DELEGATE_ADDRESS: addressValidator("MAIN_DELEGATE_ADDRESS"),
  MAIN_REGISTRY_ADDRESS: addressValidator("MAIN_REGISTRY_ADDRESS"),

  MAIN_FEE_BPS: feeBpsValidator("MAIN_FEE_BPS"),
  MAIN_JPYC_FEE_CAP_UNITS: jpycFeeCapUnitValidator("MAIN_JPYC_FEE_CAP_UNITS"),
  MAIN_USDC_FEE_CAP_UNITS: usdcFeeCapUnitValidator("MAIN_USDC_FEE_CAP_UNITS"),
  MAIN_EURC_FEE_CAP_UNITS: eurcFeeCapUnitValidator("MAIN_EURC_FEE_CAP_UNITS"),

  BASE_JPYC_TOKEN_ADDRESS: addressValidator("BASE_JPYC_TOKEN_ADDRESS"),
  BASE_USDC_TOKEN_ADDRESS: addressValidator("BASE_USDC_TOKEN_ADDRESS"),
  BASE_EURC_TOKEN_ADDRESS: addressValidator("BASE_EURC_TOKEN_ADDRESS"),

  BASE_DELEGATE_ADDRESS: addressValidator("BASE_DELEGATE_ADDRESS"),
  BASE_REGISTRY_ADDRESS: addressValidator("BASE_REGISTRY_ADDRESS"),

  BASE_FEE_BPS: feeBpsValidator("BASE_FEE_BPS"),
  BASE_JPYC_FEE_CAP_UNITS: jpycFeeCapUnitValidator("BASE_JPYC_FEE_CAP_UNITS"),
  BASE_USDC_FEE_CAP_UNITS: usdcFeeCapUnitValidator("BASE_USDC_FEE_CAP_UNITS"),
  BASE_EURC_FEE_CAP_UNITS: eurcFeeCapUnitValidator("BASE_EURC_FEE_CAP_UNITS")
});
export type Env = v.InferOutput<typeof EnvSchema>;
