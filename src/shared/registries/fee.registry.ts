import { SupportChain } from "@/configs/chain.config";
import { ENV } from "@/configs/env.config";
import { toMinUnits } from "@/helpers/token-units.helper";

import { Token } from "./token.registry";

type FeeMets = { bps: number; cap: bigint; capUnits: number };

export const FEE_REGISTORY: Record<SupportChain, Record<Token, FeeMets>> = {
  main: {
    JPYC: {
      bps: ENV.MAIN_FEE_BPS,
      cap: toMinUnits(ENV.MAIN_JPYC_FEE_CAP_UNITS, "JPYC"),
      capUnits: ENV.MAIN_JPYC_FEE_CAP_UNITS
    },
    USDC: {
      bps: ENV.MAIN_FEE_BPS,
      cap: toMinUnits(ENV.MAIN_USDC_FEE_CAP_UNITS, "USDC"),
      capUnits: ENV.MAIN_USDC_FEE_CAP_UNITS
    },
    EURC: {
      bps: ENV.MAIN_FEE_BPS,
      cap: toMinUnits(ENV.MAIN_EURC_FEE_CAP_UNITS, "EURC"),
      capUnits: ENV.MAIN_EURC_FEE_CAP_UNITS
    }
  },
  base: {
    JPYC: {
      bps: ENV.BASE_FEE_BPS,
      cap: toMinUnits(ENV.BASE_JPYC_FEE_CAP_UNITS, "JPYC"),
      capUnits: ENV.BASE_JPYC_FEE_CAP_UNITS
    },
    USDC: {
      bps: ENV.BASE_FEE_BPS,
      cap: toMinUnits(ENV.BASE_USDC_FEE_CAP_UNITS, "USDC"),
      capUnits: ENV.BASE_USDC_FEE_CAP_UNITS
    },
    EURC: {
      bps: ENV.BASE_FEE_BPS,
      cap: toMinUnits(ENV.BASE_EURC_FEE_CAP_UNITS, "EURC"),
      capUnits: ENV.BASE_EURC_FEE_CAP_UNITS
    }
  }
};
