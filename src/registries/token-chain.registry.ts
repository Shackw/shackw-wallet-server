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

import { VIEM_PUBLIC_CLIENTS } from "./viem.registry";

/** TYPES */
type Erc20Instance = GetContractReturnType<typeof erc20Abi, PublicClient<Transport, ViemChain | undefined>>;

export const TOKENS = ["JPYC", "USDC", "EURC"] as const;
export type Token = (typeof TOKENS)[number];

export const CURRENCIES = ["JPY", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const TOKEN_TO_SUPPORT_CHAIN = {
  JPYC: ["mainnet", "polygon", "sepolia", "polygonAmoy"],
  USDC: ["mainnet", "base", "polygon", "sepolia", "baseSepolia", "polygonAmoy"],
  EURC: ["mainnet", "base", "sepolia", "baseSepolia"]
} as const satisfies Record<Token, Chain[]>;

export type ChainByToken<T extends Token> = (typeof TOKEN_TO_SUPPORT_CHAIN)[T][number];

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

export type TokenByChain<T extends Chain> = (typeof SUPPORT_CHAIN_TO_TOKEN)[T][number];

const TOKEN_ADDRESSES: { [K in Token]: Record<ChainByToken<K>, Address> } = {
  JPYC: {
    mainnet: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    polygon: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    sepolia: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    polygonAmoy: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29"
  },
  USDC: {
    mainnet: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    base: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    polygon: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    sepolia: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
    baseSepolia: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
    polygonAmoy: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"
  },
  EURC: {
    mainnet: "0x1abaea1f7c830bd89acc67ec4af516284b1bc33c",
    base: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
    sepolia: "0x08210f9170f89ab7658f0b5e3ff39b0e03c594d4",
    baseSepolia: "0x808456652fdb597867f38412077a9182bf77359f"
  }
};

export const ADDRESS_TO_TOKEN = {
  mainnet: {
    [TOKEN_ADDRESSES.JPYC.mainnet]: "JPYC",
    [TOKEN_ADDRESSES.USDC.mainnet]: "USDC",
    [TOKEN_ADDRESSES.EURC.mainnet]: "EURC"
  },
  base: {
    [TOKEN_ADDRESSES.USDC.base]: "USDC",
    [TOKEN_ADDRESSES.EURC.base]: "EURC"
  },
  polygon: {
    [TOKEN_ADDRESSES.JPYC.polygon]: "JPYC",
    [TOKEN_ADDRESSES.USDC.polygon]: "USDC"
  },
  sepolia: {
    [TOKEN_ADDRESSES.JPYC.sepolia]: "JPYC",
    [TOKEN_ADDRESSES.USDC.sepolia]: "USDC",
    [TOKEN_ADDRESSES.EURC.sepolia]: "EURC"
  },
  baseSepolia: {
    [TOKEN_ADDRESSES.USDC.baseSepolia]: "USDC",
    [TOKEN_ADDRESSES.EURC.baseSepolia]: "EURC"
  },
  polygonAmoy: {
    [TOKEN_ADDRESSES.JPYC.polygonAmoy]: "JPYC",
    [TOKEN_ADDRESSES.USDC.polygonAmoy]: "USDC"
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
    address: TOKEN_ADDRESSES.JPYC,
    decimals: 18,
    baseUnit: 10n ** 18n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.JPYC.mainnet,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.JPYC.polygon,
        client: VIEM_PUBLIC_CLIENTS.polygon
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.JPYC.sepolia,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      polygonAmoy: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.JPYC.polygonAmoy,
        client: VIEM_PUBLIC_CLIENTS.polygonAmoy
      })
    }
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: TOKEN_ADDRESSES.USDC,
    decimals: 6,
    baseUnit: 10n ** 6n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.mainnet,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      base: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.base,
        client: VIEM_PUBLIC_CLIENTS.base
      }),
      polygon: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.polygon,
        client: VIEM_PUBLIC_CLIENTS.polygon
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.sepolia,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      baseSepolia: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.baseSepolia,
        client: VIEM_PUBLIC_CLIENTS.baseSepolia
      }),
      polygonAmoy: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.USDC.polygonAmoy,
        client: VIEM_PUBLIC_CLIENTS.polygonAmoy
      })
    }
  },
  EURC: {
    symbol: "EURC",
    currency: "EUR",
    address: TOKEN_ADDRESSES.EURC,
    decimals: 6,
    baseUnit: 10n ** 6n,
    contract: {
      mainnet: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.EURC.mainnet,
        client: VIEM_PUBLIC_CLIENTS.mainnet
      }),
      base: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.EURC.base,
        client: VIEM_PUBLIC_CLIENTS.base
      }),
      sepolia: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.EURC.sepolia,
        client: VIEM_PUBLIC_CLIENTS.sepolia
      }),
      baseSepolia: getContract({
        abi: erc20Abi,
        address: TOKEN_ADDRESSES.EURC.baseSepolia,
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
