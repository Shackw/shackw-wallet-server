import type {
  ChainMasterContract,
  FindChainMasterQuery,
  FindTokenDeploymentQuery,
  FindTokenMasterByAddressQuery,
  TokenDeploymentContract,
  TokenDeploymentRepository,
  TokenMasterContract
} from "@/application/ports/token-deployment.repository.port";

import {
  toChainMasterContract,
  toTokenDeploymentContract,
  toTokenMasterContract
} from "../mappers/token-deployment.entry-to-contract";
import { CHAIN_MASTER } from "../sources/chain.master";
import { TOKEN_DEPLOYMENT } from "../sources/token-deployment.relay";
import { TOKEN_MASTER } from "../sources/token.master";

export class MemoryTokenDeploymentRepository implements TokenDeploymentRepository {
  findTokenMasterByAddress({ address, chainKey }: FindTokenMasterByAddressQuery): TokenMasterContract | null {
    const depEntry = Object.values(TOKEN_DEPLOYMENT).find(
      dep => dep.chainKey === chainKey && dep.tokenAddress.toLowerCase() === address.toLowerCase()
    );

    if (!depEntry) return null;

    const tokenEntry = TOKEN_MASTER[depEntry.tokenSymbol];

    return toTokenMasterContract([depEntry.tokenSymbol, tokenEntry]);
  }

  listChainMasters(): ChainMasterContract[] {
    return Object.entries(CHAIN_MASTER).map(toChainMasterContract);
  }

  findChainMaster({ chainKey }: FindChainMasterQuery): ChainMasterContract {
    const found = CHAIN_MASTER[chainKey];
    return toChainMasterContract([chainKey, found]);
  }

  listTokenDeployment(): TokenDeploymentContract[] {
    return Object.values(TOKEN_DEPLOYMENT).map(dep =>
      toTokenDeploymentContract(TOKEN_MASTER[dep.tokenSymbol], CHAIN_MASTER[dep.chainKey], dep)
    );
  }

  findTokenDeployment({ chainKey, tokenSymbol }: FindTokenDeploymentQuery): TokenDeploymentContract | null {
    const key = `${tokenSymbol}:${chainKey}` as keyof typeof TOKEN_DEPLOYMENT;
    const depEntry = TOKEN_DEPLOYMENT[key] ?? undefined;

    if (!depEntry) return null;

    const tokenEntry = TOKEN_MASTER[depEntry.tokenSymbol];
    const chainEntry = CHAIN_MASTER[depEntry.chainKey];

    return toTokenDeploymentContract(tokenEntry, chainEntry, depEntry);
  }
}
