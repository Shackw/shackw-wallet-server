import { base, baseSepolia, type Chain } from "viem/chains";

import { ENV, Env } from "./env.config";

export const BUILD_ENV_TO_DEFAULT_CHAIN: Record<Env["NODE_ENV"], Chain> = {
  dev: baseSepolia,
  prd: base
};

export const DEFAULT_CHAIN = BUILD_ENV_TO_DEFAULT_CHAIN[ENV.NODE_ENV];
