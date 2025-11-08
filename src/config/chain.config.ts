import { mainnet, base, sepolia, baseSepolia, polygon, polygonAmoy, type Chain } from "viem/chains";

import { Env } from "@/shared/validations/schemas/env.schema";

import { ENV } from "./env.config";

export const SUPPORT_CHAIN_KEYS = ["main", "base", "polygon"] as const;
export type SupportChain = (typeof SUPPORT_CHAIN_KEYS)[number];

const BUILD_ENV_TO_SUPPORT_CHAINS: Record<Env["NODE_ENV"], Record<SupportChain, Chain>> = {
  dev: {
    main: sepolia,
    base: baseSepolia,
    polygon: polygonAmoy
  },
  prd: {
    main: mainnet,
    base: base,
    polygon: polygon
  }
};
export const SUPPORT_CHAINS = BUILD_ENV_TO_SUPPORT_CHAINS[ENV.NODE_ENV];
export const SUPPORT_CHAIN_IDS = Object.values(SUPPORT_CHAINS).map(c => c.id);
