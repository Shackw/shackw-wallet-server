import { base, baseSepolia, type Chain } from "viem/chains";

import type { Env } from "@/validations/schemas/env.schema";

import { ENV } from "./env.config";

export const BUILD_ENV_TO_DEFAULT_CHAIN: Record<Env["NODE_ENV"], Chain> = {
  dev: baseSepolia,
  prd: base
};

export const DEFAULT_CHAIN = BUILD_ENV_TO_DEFAULT_CHAIN[ENV.NODE_ENV];
