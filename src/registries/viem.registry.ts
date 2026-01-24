import { createPublicClient, http } from "viem";

import type { Chain } from "@/config/chain.config";
import { CHAINS } from "@/config/chain.config";
import { CUSTOM_RPC_URL } from "@/config/rpc-urls.config";

import type { PublicClient, Transport, Chain as ViemChain } from "viem";

export const VIEM_PUBLIC_CLIENTS: Record<Chain, PublicClient<Transport, ViemChain | undefined>> = {
  mainnet: createPublicClient({
    chain: CHAINS.mainnet,
    transport: http(CUSTOM_RPC_URL.mainnet)
  }),
  base: createPublicClient({
    chain: CHAINS.base,
    transport: http(CUSTOM_RPC_URL.base)
  }),
  polygon: createPublicClient({
    chain: CHAINS.polygon,
    transport: http(CUSTOM_RPC_URL.polygon)
  }),
  sepolia: createPublicClient({
    chain: CHAINS.sepolia,
    transport: http(CUSTOM_RPC_URL.sepolia)
  }),
  baseSepolia: createPublicClient({
    chain: CHAINS.baseSepolia,
    transport: http(CUSTOM_RPC_URL.baseSepolia)
  }),
  polygonAmoy: createPublicClient({
    chain: CHAINS.polygonAmoy,
    transport: http(CUSTOM_RPC_URL.polygonAmoy)
  })
};
