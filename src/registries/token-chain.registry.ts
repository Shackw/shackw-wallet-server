import { GetContractReturnType, getContract, erc20Abi, Address, PublicClient } from "viem";

import { SUPPORT_CHAINS, SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import { VIEM_PUBLIC_CLIENTS } from "./viem.registry";

/** TYPES */
type Erc20Instance = GetContractReturnType<typeof erc20Abi, PublicClient>;

export const TOKENS = ["JPYC", "USDC", "EURC"] as const;
export type Token = (typeof TOKENS)[number];

export const CURRENCIES = ["JPY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type ChainByToken<T extends Token> = (typeof TOKEN_TO_SUPPORT_CHAIN)[T][number];
export type TokenByChain<T extends SupportChain> = (typeof SUPPORT_CHAIN_TO_TOKEN)[T][number];

/** MAPPING */
export const TOKEN_TO_SUPPORT_CHAIN = {
  JPYC: ["main", "polygon"],
  USDC: ["main", "base", "polygon"],
  EURC: ["main", "base"]
} as const satisfies Record<Token, SupportChain[]>;

export const TOKEN_TO_SUPPORT_CHAIN_IDS = {
  JPYC: TOKEN_TO_SUPPORT_CHAIN.JPYC.map(c => SUPPORT_CHAINS[c].id),
  USDC: TOKEN_TO_SUPPORT_CHAIN.USDC.map(c => SUPPORT_CHAINS[c].id),
  EURC: TOKEN_TO_SUPPORT_CHAIN.EURC.map(c => SUPPORT_CHAINS[c].id)
} as const satisfies Record<Token, number[]>;

export const SUPPORT_CHAIN_TO_TOKEN = {
  main: ["JPYC", "USDC", "EURC"],
  base: ["USDC", "EURC"],
  polygon: ["JPYC", "USDC"]
} as const satisfies Record<SupportChain, Token[]>;

export const ADDRESS_TO_TOKEN = {
  main: {
    [ENV.MAIN_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.MAIN_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.MAIN_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  base: {
    [ENV.BASE_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.BASE_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  polygon: {
    [ENV.POLYGON_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.POLYGON_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC"
  }
} as const satisfies { [T in SupportChain]: Record<Address, TokenByChain<T>> };

/** TOKEN CONSTANT */
export type TokenMeta<T extends Token> = {
  symbol: T;
  currency: Currency;
  address: Record<ChainByToken<T>, Address>;
  decimals: number;
  baseUnit: bigint;
  contract: Record<ChainByToken<T>, Erc20Instance>;
};

export const TOKEN_REGISTRY: { [K in Token]: TokenMeta<K> } = {
  JPYC: {
    symbol: "JPYC",
    currency: "JPY",
    address: {
      main: ENV.MAIN_JPYC_TOKEN_ADDRESS,
      polygon: ENV.POLYGON_JPYC_TOKEN_ADDRESS
    },
    decimals: 18,
    baseUnit: 10n ** 18n,
    contract: {
      main: getContract({
        abi: erc20Abi,
        address: ENV.MAIN_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.main
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygon
      })
    }
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: {
      main: ENV.MAIN_USDC_TOKEN_ADDRESS,
      base: ENV.BASE_USDC_TOKEN_ADDRESS,
      polygon: ENV.POLYGON_USDC_TOKEN_ADDRESS
    },
    decimals: 6,
    baseUnit: 10n ** 6n,
    contract: {
      main: getContract({
        abi: erc20Abi,
        address: ENV.MAIN_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.main
      }),
      base: getContract({
        abi: erc20Abi,
        address: ENV.BASE_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.base
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygon
      })
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
    contract: {
      main: getContract({
        abi: erc20Abi,
        address: ENV.MAIN_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.main
      }),
      base: getContract({
        abi: erc20Abi,
        address: ENV.BASE_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.base
      })
    }
  }
};

// Helpers
export const resolveTokenAddress = <T extends Token, C extends ChainByToken<T>>(token: T, chain: C): Address =>
  TOKEN_REGISTRY[token].address[chain];

export const resolveTokenContract = <T extends Token, C extends ChainByToken<T>>(token: T, chain: C): Erc20Instance =>
  TOKEN_REGISTRY[token].contract[chain];
