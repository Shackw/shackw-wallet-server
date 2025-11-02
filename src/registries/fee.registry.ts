import { SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import { toMinUnits } from "@/shared/helpers/token-units.helper";

import { Token } from "./token.registry";

type FeeMets = { bps: bigint; capUnits: bigint; quantumUnits: bigint };

export const FEE_REGISTORY: Record<SupportChain, Record<Token, FeeMets>> = {
  main: {
    JPYC: {
      bps: ENV.MAIN_FEE_BPS,
      capUnits: toMinUnits(ENV.MAIN_JPYC_FEE_CAP_VALUE, "JPYC"),
      quantumUnits: 10n ** 16n
    },
    USDC: {
      bps: ENV.MAIN_FEE_BPS,
      capUnits: toMinUnits(ENV.MAIN_USDC_FEE_CAP_VALUE, "USDC"),
      quantumUnits: 10n ** 2n
    },
    EURC: {
      bps: ENV.MAIN_FEE_BPS,
      capUnits: toMinUnits(ENV.MAIN_EURC_FEE_CAP_VALUE, "EURC"),
      quantumUnits: 10n ** 2n
    }
  },
  base: {
    JPYC: {
      bps: ENV.BASE_FEE_BPS,
      capUnits: toMinUnits(ENV.BASE_JPYC_FEE_CAP_VALUE, "JPYC"),
      quantumUnits: 10n ** 16n
    },
    USDC: {
      bps: ENV.BASE_FEE_BPS,
      capUnits: toMinUnits(ENV.BASE_USDC_FEE_CAP_VALUE, "USDC"),
      quantumUnits: 10n ** 2n
    },
    EURC: {
      bps: ENV.BASE_FEE_BPS,
      capUnits: toMinUnits(ENV.BASE_EURC_FEE_CAP_VALUE, "EURC"),
      quantumUnits: 10n ** 2n
    }
  }
};
