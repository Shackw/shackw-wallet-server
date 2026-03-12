import type {
  ChainMasterContract,
  TokenDeploymentContract,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";
import type { ChainMasterEntry } from "@/infrastructure/masters/chain.master";
import type { TokenDeploymentMasterEntry } from "@/infrastructure/masters/token-deployment.master";
import type { TokenMasterEntry } from "@/infrastructure/masters/token.master";

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
      sponsor: entry.contracts.sponsor,
      delegate: entry.contracts.delegate,
      registry: entry.contracts.registry
    },
    viem: entry.viem
  };
};

export const toTokenDeploymentContract = (
  tokenEntry: TokenMasterEntry,
  chainEntry: ChainMasterEntry,
  depEntry: TokenDeploymentMasterEntry
): TokenDeploymentContract => {
  return {
    token: {
      address: depEntry.tokenAddress,
      symbol: depEntry.tokenSymbol,
      currency: tokenEntry.currency,
      decimals: tokenEntry.decimals
    },
    chain: { key: depEntry.chainKey, id: chainEntry.id, rpcUrl: chainEntry.rpcUrl, viem: chainEntry.viem },
    contracts: {
      sponsor: chainEntry.contracts.sponsor,
      delegate: chainEntry.contracts.delegate,
      registry: chainEntry.contracts.registry
    },
    minTransferAmountUnits: depEntry.minTransferAmountUnits,
    fixedFeeAmountUnits: depEntry.fixedFeeAmountUnits
  };
};
