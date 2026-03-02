import type { Chain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import type { Token } from "@/config/token.config";

import type { Address } from "viem";

export type TokenDeploymentMasterEntry = {
  tokenSymbol: Token;
  chainKey: Chain;
  tokenAddress: Address;
  minTransferAmountUnits: bigint;
  fixedFeeAmountUnits: bigint;
};

export type TokenDeploymentMaster = Partial<Record<`${Token}:${Chain}`, TokenDeploymentMasterEntry>>;

export const TOKEN_DEPLOYMENT = {
  "JPYC:mainnet": {
    tokenSymbol: "JPYC",
    chainKey: "mainnet",
    tokenAddress: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    minTransferAmountUnits: ENV.ETH_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_JPYC_FIXED_FEE_AMOUNT_UNITS
  },
  "JPYC:polygon": {
    tokenSymbol: "JPYC",
    chainKey: "polygon",
    tokenAddress: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    minTransferAmountUnits: ENV.POLYGON_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.POLYGON_JPYC_FIXED_FEE_AMOUNT_UNITS
  },
  "JPYC:sepolia": {
    tokenSymbol: "JPYC",
    chainKey: "sepolia",
    tokenAddress: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    minTransferAmountUnits: ENV.ETH_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_JPYC_FIXED_FEE_AMOUNT_UNITS
  },
  "JPYC:polygonAmoy": {
    tokenSymbol: "JPYC",
    chainKey: "polygonAmoy",
    tokenAddress: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    minTransferAmountUnits: ENV.POLYGON_JPYC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.POLYGON_JPYC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:mainnet": {
    tokenSymbol: "USDC",
    chainKey: "mainnet",
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    minTransferAmountUnits: ENV.ETH_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:base": {
    tokenSymbol: "USDC",
    chainKey: "base",
    tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    minTransferAmountUnits: ENV.BASE_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.BASE_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:polygon": {
    tokenSymbol: "USDC",
    chainKey: "polygon",
    tokenAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    minTransferAmountUnits: ENV.POLYGON_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.POLYGON_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:sepolia": {
    tokenSymbol: "USDC",
    chainKey: "sepolia",
    tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
    minTransferAmountUnits: ENV.ETH_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:baseSepolia": {
    tokenSymbol: "USDC",
    chainKey: "baseSepolia",
    tokenAddress: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
    minTransferAmountUnits: ENV.BASE_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.BASE_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "USDC:polygonAmoy": {
    tokenSymbol: "USDC",
    chainKey: "polygonAmoy",
    tokenAddress: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
    minTransferAmountUnits: ENV.POLYGON_USDC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.POLYGON_USDC_FIXED_FEE_AMOUNT_UNITS
  },
  "EURC:mainnet": {
    tokenSymbol: "EURC",
    chainKey: "mainnet",
    tokenAddress: "0x1abaea1f7c830bd89acc67ec4af516284b1bc33c",
    minTransferAmountUnits: ENV.ETH_EURC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_EURC_FIXED_FEE_AMOUNT_UNITS
  },
  "EURC:base": {
    tokenSymbol: "EURC",
    chainKey: "base",
    tokenAddress: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
    minTransferAmountUnits: ENV.BASE_EURC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.BASE_EURC_FIXED_FEE_AMOUNT_UNITS
  },
  "EURC:sepolia": {
    tokenSymbol: "EURC",
    chainKey: "sepolia",
    tokenAddress: "0x08210f9170f89ab7658f0b5e3ff39b0e03c594d4",
    minTransferAmountUnits: ENV.ETH_EURC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.ETH_EURC_FIXED_FEE_AMOUNT_UNITS
  },
  "EURC:baseSepolia": {
    tokenSymbol: "EURC",
    chainKey: "baseSepolia",
    tokenAddress: "0x808456652fdb597867f38412077a9182bf77359f",
    minTransferAmountUnits: ENV.BASE_EURC_MIN_TRANSFER_AMOUNT_UNITS,
    fixedFeeAmountUnits: ENV.BASE_EURC_FIXED_FEE_AMOUNT_UNITS
  }
} as const satisfies TokenDeploymentMaster;
