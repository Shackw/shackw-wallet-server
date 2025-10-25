import { mainnet, base, sepolia, baseSepolia, type Chain } from "viem/chains";

import type { Env } from "@/validations/schemas/env.schema";

import { ENV } from "./env.config";

export const SUPPORT_CHAIN_KEYS = ["main", "base"] as const;
export type SupportChain = (typeof SUPPORT_CHAIN_KEYS)[number];

const BUILD_ENV_TO_SUPPORT_CHAINS: Record<Env["NODE_ENV"], Record<SupportChain, Chain>> = {
  dev: {
    main: sepolia,
    base: baseSepolia
  },
  prd: {
    main: mainnet,
    base: base
  }
};
export const SUPPORT_CHAINS = BUILD_ENV_TO_SUPPORT_CHAINS[ENV.NODE_ENV];
export const SUPPORT_CHAIN_IDS = Object.values(SUPPORT_CHAINS).map(c => c.id);
