import { ENV } from "./env.config";

import type { Chain } from "./chain.config";

export const CUSTOM_RPC_URL: Record<Chain, string> = {
  mainnet: `https://mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
  base: `https://base-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
  polygon: `https://polygon-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
  sepolia: `https://sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
  baseSepolia: `https://base-sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
  polygonAmoy: `https://polygon-amoy.infura.io/v3/${ENV.RPC_INFURA_ID}`
};
