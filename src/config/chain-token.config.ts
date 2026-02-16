import type { Chain } from "./chain.config";
import type { Token } from "./token.config";

export const CHAIN_TO_TOKEN = {
  mainnet: ["JPYC", "USDC", "EURC"],
  base: ["USDC", "EURC"],
  polygon: ["JPYC", "USDC"],
  sepolia: ["JPYC", "USDC", "EURC"],
  baseSepolia: ["USDC", "EURC"],
  polygonAmoy: ["JPYC", "USDC"]
} as const satisfies Record<Chain, Token[]>;

export type TokenByChain<T extends Chain> = (typeof CHAIN_TO_TOKEN)[T][number];
