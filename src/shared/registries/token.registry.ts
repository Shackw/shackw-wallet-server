import { Address, erc20Abi, getContract, GetContractReturnType } from "viem";

import type { SupportChain } from "@/configs/chain.config";
import { ENV } from "@/configs/env.config";
import { VIEM_PUBLIC_CLIENTS } from "@/registries/viem.registry";

export const TOKENS = ["JPYC", "USDC", "EURC"] as const;
export type Token = (typeof TOKENS)[number];

export const CURRENCIES = ["JPY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type TokenMeta = {
  symbol: string;
  currency: Currency;
  address: Record<SupportChain, Address>;
  decimals: number;
  baseUnit: bigint;
  minTransferAmountUnits: bigint;
  contract: Record<SupportChain, GetContractReturnType>;
};

export const TOKEN_REGISTRY = {
  JPYC: {
    symbol: "JPYC",
    currency: "JPY",
    address: {
      main: ENV.MAIN_JPYC_TOKEN_ADDRESS,
      base: ENV.BASE_JPYC_TOKEN_ADDRESS
    },
    decimals: 18,
    baseUnit: 10n ** 18n,
    minTransferAmountUnits: 100n * 10n ** 18n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.MAIN_JPYC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.BASE_JPYC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: {
      main: ENV.MAIN_USDC_TOKEN_ADDRESS,
      base: ENV.BASE_USDC_TOKEN_ADDRESS
    },
    decimals: 6,
    baseUnit: 10n ** 6n,
    minTransferAmountUnits: 10n ** 6n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.MAIN_USDC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.BASE_USDC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  },
  EURC: {
    symbol: "EURC",
    currency: "EUR",
    address: {
      main: ENV.MAIN_EURC_TOKEN_ADDRESS,
      base: ENV.BASE_EURC_TOKEN_ADDRESS
    },
    decimals: 6,
    baseUnit: 10n ** 6n,
    minTransferAmountUnits: 10n ** 6n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.MAIN_EURC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.BASE_EURC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  }
} as const satisfies Record<Token, TokenMeta>;

export const ADDRESS_TO_TOKEN = {
  main: {
    [ENV.MAIN_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.MAIN_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.MAIN_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  base: {
    [ENV.BASE_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.BASE_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.BASE_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  }
} as const satisfies Record<SupportChain, Record<Address, Token>>;
