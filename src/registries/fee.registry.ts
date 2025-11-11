import { Chain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import { TokenByChain } from "./token-chain.registry";

type FeeMeta = {
  minTransferAmountUnits: bigint;
  fixedFeeAmountUnits: bigint;
};

export const FEE_REGISTORY: { [T in Chain]: Record<TokenByChain<T>, FeeMeta> } = {
  mainnet: {
    JPYC: {
      minTransferAmountUnits: ENV.ETH_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_JPYC_FIXED_FEE_AMOUNT_UNITS
    },
    USDC: {
      minTransferAmountUnits: ENV.ETH_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_USDC_FIXED_FEE_AMOUNT_UNITS
    },
    EURC: {
      minTransferAmountUnits: ENV.ETH_EURC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_EURC_FIXED_FEE_AMOUNT_UNITS
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
  },
  sepolia: {
    JPYC: {
      minTransferAmountUnits: ENV.ETH_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_JPYC_FIXED_FEE_AMOUNT_UNITS
    },
    USDC: {
      minTransferAmountUnits: ENV.ETH_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_USDC_FIXED_FEE_AMOUNT_UNITS
    },
    EURC: {
      minTransferAmountUnits: ENV.ETH_EURC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.ETH_EURC_FIXED_FEE_AMOUNT_UNITS
    }
  },
  baseSepolia: {
    USDC: {
      minTransferAmountUnits: ENV.BASE_USDC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.BASE_USDC_FIXED_FEE_AMOUNT_UNITS
    },
    EURC: {
      minTransferAmountUnits: ENV.BASE_EURC_MIN_TRANSFER_AMOUNT_UNITS,
      fixedFeeAmountUnits: ENV.BASE_EURC_FIXED_FEE_AMOUNT_UNITS
    }
  },
  polygonAmoy: {
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
