import { Address, erc20Abi, getContract, GetContractReturnType } from "viem";

import { ENV } from "@/configs/env.config";
import { VIEM_PUBLIC_CLIENT } from "@/configs/viem.config";

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
  contract: GetContractReturnType;
};

export const TOKEN_REGISTRY = {
  JPYC: {
    symbol: "JPYC",
    currency: "JPY",
    address: ENV.JPYC_TOKEN_ADDRESS,
    decimals: 18,
    baseUnit: 1_000_000_000_000_000_000n,
    contract: getContract({ abi: erc20Abi, address: ENV.JPYC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENT })
  },
  USDC: {
    symbol: "USDC",
    currency: "USD",
    address: ENV.USDC_TOKEN_ADDRESS,
    decimals: 6,
    baseUnit: 1_000_000n,
    contract: getContract({ abi: erc20Abi, address: ENV.USDC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENT })
  },
  EURC: {
    symbol: "EURC",
    currency: "EUR",
    address: ENV.EURC_TOKEN_ADDRESS,
    decimals: 6,
    baseUnit: 1_000_000n,
    contract: getContract({ abi: erc20Abi, address: ENV.EURC_TOKEN_ADDRESS, client: VIEM_PUBLIC_CLIENT })
  }
} as const satisfies Record<Token, TokenMeta>;
