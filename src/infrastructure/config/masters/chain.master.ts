import { mainnet, base, polygon, sepolia, baseSepolia, polygonAmoy } from "viem/chains";

import type { Chain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

import type { Address } from "viem";
import type { Chain as ViemChain } from "viem/chains";

export type ChainMasterEntry = {
  id: number;
  rpcUrl: string;
  contracts: {
    delegate: Address;
    registry: Address;
  };
  viem: ViemChain;
};

export type ChainMaster = Record<Chain, ChainMasterEntry>;

export const CHAIN_MASTER = {
  mainnet: {
    id: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.ETH_MAIN_DELEGATE_ADDRESS,
      registry: ENV.ETH_MAIN_REGISTRY_ADDRESS
    },
    viem: mainnet
  },
  base: {
    id: 8453,
    rpcUrl: `https://base-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.BASE_MAIN_DELEGATE_ADDRESS,
      registry: ENV.BASE_MAIN_REGISTRY_ADDRESS
    },
    viem: base
  },
  polygon: {
    id: 137,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.POLYGON_MAIN_DELEGATE_ADDRESS,
      registry: ENV.POLYGON_MAIN_REGISTRY_ADDRESS
    },
    viem: polygon
  },
  sepolia: {
    id: 11155111,
    rpcUrl: `https://sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.ETH_SEPOLIA_DELEGATE_ADDRESS,
      registry: ENV.ETH_SEPOLIA_REGISTRY_ADDRESS
    },
    viem: sepolia
  },
  baseSepolia: {
    id: 84532,
    rpcUrl: `https://base-sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.BASE_SEPOLIA_DELEGATE_ADDRESS,
      registry: ENV.BASE_SEPOLIA_REGISTRY_ADDRESS
    },
    viem: baseSepolia
  },
  polygonAmoy: {
    id: 80002,
    rpcUrl: `https://polygon-amoy.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      delegate: ENV.POLYGON_AMOY_DELEGATE_ADDRESS,
      registry: ENV.POLYGON_AMOY_REGISTRY_ADDRESS
    },
    viem: polygonAmoy
  }
} as const satisfies ChainMaster;
