import {
  getContract,
  erc20Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  Transport,
  Chain as ViemChain
} from "viem";

import { CHAINS, Chain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import { VIEM_PUBLIC_CLIENTS } from "./viem.registry";

/** TYPES */
type Erc20Instance = GetContractReturnType<typeof erc20Abi, PublicClient<Transport, ViemChain | undefined>>;

export const TOKENS = ["JPYC", "USDC", "EURC"] as const;
export type Token = (typeof TOKENS)[number];

export const CURRENCIES = ["JPY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type ChainByToken<T extends Token> = (typeof TOKEN_TO_SUPPORT_CHAIN)[T][number];
export type TokenByChain<T extends Chain> = (typeof SUPPORT_CHAIN_TO_TOKEN)[T][number];

/** MAPPING */
export const TOKEN_TO_SUPPORT_CHAIN = {
  JPYC: ["mainnet", "polygon", "sepolia", "polygonAmoy"],
  USDC: ["mainnet", "base", "polygon", "sepolia", "baseSepolia", "polygonAmoy"],
  EURC: ["mainnet", "base", "sepolia", "baseSepolia"]
} as const satisfies Record<Token, Chain[]>;

export const TOKEN_TO_SUPPORT_CHAIN_IDS = {
  JPYC: TOKEN_TO_SUPPORT_CHAIN.JPYC.map(c => CHAINS[c].id),
  USDC: TOKEN_TO_SUPPORT_CHAIN.USDC.map(c => CHAINS[c].id),
  EURC: TOKEN_TO_SUPPORT_CHAIN.EURC.map(c => CHAINS[c].id)
} as const satisfies Record<Token, number[]>;

export const SUPPORT_CHAIN_TO_TOKEN = {
  mainnet: ["JPYC", "USDC", "EURC"],
  base: ["USDC", "EURC"],
  polygon: ["JPYC", "USDC"],
  sepolia: ["JPYC", "USDC", "EURC"],
  baseSepolia: ["USDC", "EURC"],
  polygonAmoy: ["JPYC", "USDC"]
} as const satisfies Record<Chain, Token[]>;

export const ADDRESS_TO_TOKEN = {
  mainnet: {
    [ENV.ETH_MAIN_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.ETH_MAIN_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.ETH_MAIN_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  base: {
    [ENV.BASE_MAIN_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.BASE_MAIN_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  polygon: {
    [ENV.POLYGON_MAIN_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.POLYGON_MAIN_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC"
  },
  sepolia: {
    [ENV.ETH_SEPOLIA_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.ETH_SEPOLIA_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.ETH_SEPOLIA_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  baseSepolia: {
    [ENV.BASE_SEPOLIA_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC",
    [ENV.BASE_SEPOLIA_EURC_TOKEN_ADDRESS.toLowerCase() as Address]: "EURC"
  },
  polygonAmoy: {
    [ENV.POLYGON_AMOY_JPYC_TOKEN_ADDRESS.toLowerCase() as Address]: "JPYC",
    [ENV.POLYGON_AMOY_USDC_TOKEN_ADDRESS.toLowerCase() as Address]: "USDC"
  }
} as const satisfies { [T in Chain]: Record<Address, TokenByChain<T>> };

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
      mainnet: ENV.ETH_MAIN_JPYC_TOKEN_ADDRESS,
      polygon: ENV.POLYGON_MAIN_JPYC_TOKEN_ADDRESS,
      sepolia: ENV.ETH_SEPOLIA_JPYC_TOKEN_ADDRESS,
      polygonAmoy: ENV.POLYGON_AMOY_JPYC_TOKEN_ADDRESS
    },
    decimals: 18,
    baseUnit: 10n ** 18n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: ENV.ETH_MAIN_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_MAIN_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygon
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: ENV.ETH_SEPOLIA_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      polygonAmoy: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_AMOY_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygonAmoy
      })
    }
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: {
      mainnet: ENV.ETH_MAIN_USDC_TOKEN_ADDRESS,
      base: ENV.BASE_MAIN_USDC_TOKEN_ADDRESS,
      polygon: ENV.POLYGON_MAIN_JPYC_TOKEN_ADDRESS,
      sepolia: ENV.ETH_SEPOLIA_USDC_TOKEN_ADDRESS,
      baseSepolia: ENV.BASE_SEPOLIA_USDC_TOKEN_ADDRESS,
      polygonAmoy: ENV.POLYGON_AMOY_USDC_TOKEN_ADDRESS
    },
    decimals: 6,
    baseUnit: 10n ** 6n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: ENV.ETH_MAIN_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      base: getContract({
        abi: erc20Abi,
        address: ENV.BASE_MAIN_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.base
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_MAIN_JPYC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygon
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: ENV.ETH_SEPOLIA_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      baseSepolia: getContract({
        abi: erc20Abi,
        address: ENV.BASE_SEPOLIA_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.baseSepolia
      }),
      polygonAmoy: getContract({
        abi: erc20Abi,
        address: ENV.POLYGON_AMOY_USDC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.polygonAmoy
      })
    }
  },
  EURC: {
    symbol: "EURC",
    currency: "EUR",
    address: {
      mainnet: ENV.ETH_MAIN_EURC_TOKEN_ADDRESS,
      base: ENV.BASE_MAIN_EURC_TOKEN_ADDRESS,
      sepolia: ENV.ETH_SEPOLIA_EURC_TOKEN_ADDRESS,
      baseSepolia: ENV.BASE_SEPOLIA_EURC_TOKEN_ADDRESS
    },
    decimals: 6,
    baseUnit: 10n ** 6n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: ENV.ETH_MAIN_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      base: getContract({
        abi: erc20Abi,
        address: ENV.BASE_MAIN_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.base
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: ENV.ETH_SEPOLIA_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      baseSepolia: getContract({
        abi: erc20Abi,
        address: ENV.BASE_SEPOLIA_EURC_TOKEN_ADDRESS,
        client: VIEM_PUBLIC_CLIENTS.baseSepolia
      })
    }
  }
};

// Helpers
export const resolveTokenAddress = <T extends Token, C extends ChainByToken<T>>(token: T, chain: C): Address =>
  TOKEN_REGISTRY[token].address[chain];

export const resolveTokenContract = <T extends Token, C extends ChainByToken<T>>(token: T, chain: C): Erc20Instance =>
  TOKEN_REGISTRY[token].contract[chain];
