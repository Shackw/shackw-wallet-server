import { SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import { TokenByChain } from "./token-chain.registry";

type FeeMeta = {
  minTransferAmountUnits: bigint;
  fixedFeeAmountUnits: bigint;
};

export const FEE_REGISTORY: { [T in SupportChain]: Record<TokenByChain<T>, FeeMeta> } = {
  main: {
    JPYC: {
      minTransferAmountUnits: ENV.MAIN_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.MAIN_JPYC_FIXED_FEE_AMOUNT_UNITS
    },
    USDC: {
      minTransferAmountUnits: ENV.MAIN_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.MAIN_USDC_FIXED_FEE_AMOUNT_UNITS
    },
    EURC: {
      minTransferAmountUnits: ENV.MAIN_EURC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.MAIN_EURC_FIXED_FEE_AMOUNT_UNITS
    }
  },
  base: {
    USDC: {
      minTransferAmountUnits: ENV.BASE_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.BASE_USDC_FIXED_FEE_AMOUNT_UNITS
    },
    EURC: {
      minTransferAmountUnits: ENV.BASE_EURC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.BASE_EURC_FIXED_FEE_AMOUNT_UNITS
    }
  },
  polygon: {
    JPYC: {
      minTransferAmountUnits: ENV.POLYGON_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.POLYGON_JPYC_FIXED_FEE_AMOUNT_UNITS
    },
    USDC: {
      minTransferAmountUnits: ENV.POLYGON_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.POLYGON_USDC_FIXED_FEE_AMOUNT_UNITS
    }
  }
};
