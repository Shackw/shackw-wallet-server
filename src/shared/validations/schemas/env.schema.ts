import * as v from "valibot";

import { hex32Validator, addressValidator, hex64Validator } from "../rules/address.validator";
import {
  feeBpsValidator,
  jpycFeeCapDecimalsValidator,
  usdcFeeCapDecimalsValidator,
  eurcFeeCapDecimalsValidator
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
  MAIN_JPYC_FEE_CAP_VALUE: jpycFeeCapDecimalsValidator("MAIN_JPYC_FEE_CAP_VALUE"),
  MAIN_USDC_FEE_CAP_VALUE: usdcFeeCapDecimalsValidator("MAIN_USDC_FEE_CAP_VALUE"),
  MAIN_EURC_FEE_CAP_VALUE: eurcFeeCapDecimalsValidator("MAIN_EURC_FEE_CAP_VALUE"),

  BASE_JPYC_TOKEN_ADDRESS: addressValidator("BASE_JPYC_TOKEN_ADDRESS"),
  BASE_USDC_TOKEN_ADDRESS: addressValidator("BASE_USDC_TOKEN_ADDRESS"),
  BASE_EURC_TOKEN_ADDRESS: addressValidator("BASE_EURC_TOKEN_ADDRESS"),

  BASE_DELEGATE_ADDRESS: addressValidator("BASE_DELEGATE_ADDRESS"),
  BASE_REGISTRY_ADDRESS: addressValidator("BASE_REGISTRY_ADDRESS"),

  BASE_FEE_BPS: feeBpsValidator("BASE_FEE_BPS"),
  BASE_JPYC_FEE_CAP_VALUE: jpycFeeCapDecimalsValidator("BASE_JPYC_FEE_CAP_VALUE"),
  BASE_USDC_FEE_CAP_VALUE: usdcFeeCapDecimalsValidator("BASE_USDC_FEE_CAP_VALUE"),
  BASE_EURC_FEE_CAP_VALUE: eurcFeeCapDecimalsValidator("BASE_EURC_FEE_CAP_VALUE")
});
export type Env = v.InferOutput<typeof EnvSchema>;
