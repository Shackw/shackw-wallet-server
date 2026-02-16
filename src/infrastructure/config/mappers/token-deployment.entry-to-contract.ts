import type {
  ChainMasterContract,
  TokenDeploymentContract,
  TokenMasterContract
} from "@/application/ports/token-deployment.repository.port";
import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

import type { ChainMasterEntry } from "../sources/chain.master";
import type { TokenDeploymentRelayEntry } from "../sources/token-deployment.relay";
import type { TokenMasterEntry } from "../sources/token.master";
import type { Address } from "viem";

export const toTokenMasterContract = ([key, entry]: [string, TokenMasterEntry]): TokenMasterContract => {
  return {
    symbol: key as Token,
    currency: entry.currency,
    decimals: entry.decimals
  };
};

export const toChainMasterContract = ([key, entry]: [string, ChainMasterEntry]): ChainMasterContract => {
  return {
    key: key as Chain,
    id: entry.id,
    rpcUrl: entry.rpcUrl,
    contracts: {
      delegate: entry.contracts.delegate.toLowerCase() as Address,
      registry: entry.contracts.registry.toLowerCase() as Address
    },
    viem: entry.viem
  };
};

export const toTokenDeploymentContract = (
  tokenEntry: TokenMasterEntry,
  chainEntry: ChainMasterEntry,
  depEntry: TokenDeploymentRelayEntry
): TokenDeploymentContract => {
  return {
    token: {
      address: depEntry.tokenAddress.toLowerCase() as Address,
      symbol: depEntry.tokenSymbol,
      currency: tokenEntry.currency,
      decimals: tokenEntry.decimals
    },
    chain: { key: depEntry.chainKey, id: chainEntry.id, rpcUrl: chainEntry.rpcUrl, viem: chainEntry.viem },
    contracts: {
      delegate: chainEntry.contracts.delegate.toLowerCase() as Address,
      registry: chainEntry.contracts.registry.toLowerCase() as Address
    },
    minTransferAmountUnits: depEntry.minTransferAmountUnits,
    fixedFeeAmountUnits: depEntry.fixedFeeAmountUnits
  };
};
