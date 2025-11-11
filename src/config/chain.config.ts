import { mainnet, base, sepolia, baseSepolia, polygon, polygonAmoy, Chain as ViemChain } from "viem/chains";

export type Chain = (typeof CHAIN_KEYS)[number];

export const CHAIN_KEYS = ["mainnet", "base", "polygon", "sepolia", "baseSepolia", "polygonAmoy"] as const;

export const CHAINS: Record<Chain, ViemChain> = {
  mainnet,
  base,
  polygon,
  sepolia,
  baseSepolia,
  polygonAmoy
};

export const CHAIN_IDS = Object.values(CHAINS).map(c => c.id);
