import { mainnet, base, polygon, sepolia, baseSepolia, polygonAmoy } from "viem/chains";

import type { Chain as ViemChain } from "viem/chains";

export type Chain = (typeof CHAIN_KEYS)[number];

export const CHAIN_KEYS = ["mainnet", "base", "polygon", "sepolia", "baseSepolia", "polygonAmoy"] as const;

export const CHAIN_KEY_TO_VIEM_CHAIN = {
  mainnet,
  base,
  polygon,
  sepolia,
  baseSepolia,
  polygonAmoy
} satisfies Record<Chain, ViemChain>;
