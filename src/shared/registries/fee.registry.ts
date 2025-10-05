import { ENV } from "@/configs/env.config";
import { toMinUnits } from "@/helpers/token-units.helper";

import { Token } from "./token.registry";

type FeeMets = { bps: number; cap: bigint; capUnits: number };

export const FEE_REGISTORY = {
  JPYC: {
    bps: ENV.FEE_BPS,
    cap: toMinUnits(ENV.JPYC_FEE_CAP_UNITS, "JPYC"),
    capUnits: ENV.JPYC_FEE_CAP_UNITS
  },
  USDC: {
    bps: ENV.FEE_BPS,
    cap: toMinUnits(ENV.USDC_FEE_CAP_UNITS, "USDC"),
    capUnits: ENV.USDC_FEE_CAP_UNITS
  },
  EURC: {
    bps: ENV.FEE_BPS,
    cap: toMinUnits(ENV.EURC_FEE_CAP_UNITS, "EURC"),
    capUnits: ENV.EURC_FEE_CAP_UNITS
  }
} as const satisfies Record<Token, FeeMets>;
