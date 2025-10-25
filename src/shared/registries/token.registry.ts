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
  address: Address;
  decimals: number;
  baseUnit: bigint;
  minTransferAmountUnits: bigint;
  contract: Record<SupportChain, GetContractReturnType>;
};

export const TOKEN_REGISTRY = {
  JPYC: {
    symbol: "JPYC",
    currency: "JPY",
    address: ENV.JPYC_TOKEN_ADDRESS,
    decimals: 18,
    baseUnit: 10n ** 18n,
    minTransferAmountUnits: 100n * 10n ** 18n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.JPYC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.JPYC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: ENV.USDC_TOKEN_ADDRESS,
    decimals: 6,
    baseUnit: 10n ** 6n,
    minTransferAmountUnits: 10n ** 6n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.USDC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.USDC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  },
  EURC: {
    symbol: "EURC",
    currency: "EUR",
    address: ENV.EURC_TOKEN_ADDRESS,
    decimals: 6,
    baseUnit: 10n ** 6n,
    minTransferAmountUnits: 10n ** 6n,
    contract: {
      main: getContract({ abi: erc20Abi, address: ENV.EURC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.main }),
      base: getContract({ abi: erc20Abi, address: ENV.EURC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENTS.base })
    }
  }
} as const satisfies Record<Token, TokenMeta>;

export const ADDRESS_TO_TOKEN = {
  [ENV.JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
  [ENV.USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
  [ENV.EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
} as const satisfies Record<Address, Token>;
