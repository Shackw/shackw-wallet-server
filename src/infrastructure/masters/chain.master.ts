import { getAddress, type Address } from "viem";

import { ENV } from "@/config/env.config";
import { CHAIN_KEY_TO_VIEM_CHAIN, type Chain } from "@/domain/constants/chain.constant";

import type { Chain as ViemChain } from "viem/chains";

export type ChainMasterEntry = {
  id: number;
  rpcUrl: string;
  contracts: {
    sponsor: Address;
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
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.ETH_MAIN_DELEGATE_ADDRESS),
      registry: getAddress(ENV.ETH_MAIN_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
  },
  base: {
    id: 8453,
    rpcUrl: `https://base-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.BASE_MAIN_DELEGATE_ADDRESS),
      registry: getAddress(ENV.BASE_MAIN_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.base
  },
  polygon: {
    id: 137,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.POLYGON_MAIN_DELEGATE_ADDRESS),
      registry: getAddress(ENV.POLYGON_MAIN_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.polygon
  },
  sepolia: {
    id: 11155111,
    rpcUrl: `https://sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.ETH_SEPOLIA_DELEGATE_ADDRESS),
      registry: getAddress(ENV.ETH_SEPOLIA_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.sepolia
  },
  baseSepolia: {
    id: 84532,
    rpcUrl: `https://base-sepolia.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.BASE_SEPOLIA_DELEGATE_ADDRESS),
      registry: getAddress(ENV.BASE_SEPOLIA_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.baseSepolia
  },
  polygonAmoy: {
    id: 80002,
    rpcUrl: `https://polygon-amoy.infura.io/v3/${ENV.RPC_INFURA_ID}`,
    contracts: {
      sponsor: getAddress(ENV.SPONSOR_ADDRESS),
      delegate: getAddress(ENV.POLYGON_AMOY_DELEGATE_ADDRESS),
      registry: getAddress(ENV.POLYGON_AMOY_REGISTRY_ADDRESS)
    },
    viem: CHAIN_KEY_TO_VIEM_CHAIN.polygonAmoy
  }
} as const satisfies ChainMaster;
