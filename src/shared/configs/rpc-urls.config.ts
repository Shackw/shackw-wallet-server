import type { Env } from "@/validations/schemas/env.schema";

import { SupportChain } from "./chain.config";
import { ENV } from "./env.config";

const BUILD_ENV_TO_CUSTOM_RPC_URLS: Record<Env["NODE_ENV"], Record<SupportChain, string>> = {
  dev: {
    main: `https://sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    base: `https://base-sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`
  },
  prd: {
    main: `https://mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    base: `https://base-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`
  }
};
export const CUSTOM_RPC_URLS = BUILD_ENV_TO_CUSTOM_RPC_URLS[ENV.NODE_ENV];
