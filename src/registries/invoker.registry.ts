import type { Chain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import type { Address } from "viem";

export const DELEGATE_CONTRACT_ADDRESS_REGISTORY: Record<Chain, Address> = {
  mainnet: ENV.ETH_MAIN_DELEGATE_ADDRESS,
  base: ENV.BASE_MAIN_DELEGATE_ADDRESS,
  polygon: ENV.POLYGON_MAIN_DELEGATE_ADDRESS,
  sepolia: ENV.ETH_SEPOLIA_DELEGATE_ADDRESS,
  baseSepolia: ENV.BASE_SEPOLIA_DELEGATE_ADDRESS,
  polygonAmoy: ENV.POLYGON_AMOY_DELEGATE_ADDRESS
};

export const REGISTRY_CONTRACT_ADDRESS_REGISTORY: Record<Chain, Address> = {
  mainnet: ENV.ETH_MAIN_REGISTRY_ADDRESS,
  base: ENV.BASE_MAIN_REGISTRY_ADDRESS,
  polygon: ENV.POLYGON_MAIN_REGISTRY_ADDRESS,
  sepolia: ENV.ETH_SEPOLIA_REGISTRY_ADDRESS,
  baseSepolia: ENV.BASE_SEPOLIA_REGISTRY_ADDRESS,
  polygonAmoy: ENV.POLYGON_AMOY_REGISTRY_ADDRESS
};
