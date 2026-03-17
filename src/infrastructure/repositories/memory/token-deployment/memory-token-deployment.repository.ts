import { isAddressEqual } from "viem";

import type {
  ChainMasterContract,
  FindChainMasterQuery,
  FindTokenDeploymentQuery,
  FindTokenMasterByAddressQuery,
  TokenDeploymentContract,
  TokenDeploymentRepository,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import type { ChainMaster } from "@/infrastructure/masters/chain.master";
import type { TokenDeploymentMaster } from "@/infrastructure/masters/token-deployment.master";
import type { TokenMaster } from "@/infrastructure/masters/token.master";

import {
  toChainMasterContract,
  toTokenDeploymentContract,
  toTokenMasterContract
} from "./memory-token-deployment.entry-to-contract";

export class MemoryTokenDeploymentRepository implements TokenDeploymentRepository {
  async findTokenMasterByAddress({
    address,
    chainKey
  }: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
    const tokenMaster = await this._getTokenMaster();
    const tokenDeploymentMaster = await this._getTokenDeploymentMaster();

    const depEntry = Object.values(tokenDeploymentMaster).find(
      dep => dep.chainKey === chainKey && isAddressEqual(dep.tokenAddress, address)
    );

    if (!depEntry) return null;

    const tokenEntry = tokenMaster[depEntry.tokenSymbol];

    return toTokenMasterContract([depEntry.tokenSymbol, tokenEntry]);
  }

  async listChainMasters(): Promise<ChainMasterContract[]> {
    const chainMaster = await this._getChainMaster();
    return Object.entries(chainMaster).map(toChainMasterContract);
  }

  async findChainMaster({ chainKey }: FindChainMasterQuery): Promise<ChainMasterContract> {
    const chainMaster = await this._getChainMaster();

    const found = chainMaster[chainKey];
    return toChainMasterContract([chainKey, found]);
  }

  async listTokenDeployment(): Promise<TokenDeploymentContract[]> {
    const chainMaster = await this._getChainMaster();
    const tokenMaster = await this._getTokenMaster();
    const tokenDeploymentMaster = await this._getTokenDeploymentMaster();

    return Object.values(tokenDeploymentMaster).map(dep =>
      toTokenDeploymentContract(tokenMaster[dep.tokenSymbol], chainMaster[dep.chainKey], dep)
    );
  }

  async findTokenDeployment({
    chainKey,
    tokenSymbol
  }: FindTokenDeploymentQuery): Promise<TokenDeploymentContract | null> {
    const chainMaster = await this._getChainMaster();
    const tokenMaster = await this._getTokenMaster();
    const tokenDeploymentMaster = await this._getTokenDeploymentMaster();

    const key = `${tokenSymbol}:${chainKey}` as unknown as keyof TokenDeploymentMaster;
    const depEntry = tokenDeploymentMaster[key] ?? undefined;

    if (!depEntry) return null;

    const tokenEntry = tokenMaster[depEntry.tokenSymbol];
    const chainEntry = chainMaster[depEntry.chainKey];

    return toTokenDeploymentContract(tokenEntry, chainEntry, depEntry);
  }

  protected async _getChainMaster(): Promise<ChainMaster> {
    const { CHAIN_MASTER } = await import("@/infrastructure/masters/chain.master");
    return CHAIN_MASTER;
  }

  protected async _getTokenMaster(): Promise<TokenMaster> {
    const { TOKEN_MASTER } = await import("@/infrastructure/masters/token.master");
    return TOKEN_MASTER;
  }

  protected async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
    const { TOKEN_DEPLOYMENT_MASTER } = await import("@/infrastructure/masters/token-deployment.master");
    return TOKEN_DEPLOYMENT_MASTER;
  }
}
