import { getContract } from "viem";

import type { GetNextNonceQuery, RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";
import type { Chain } from "@/domain/constants/chain.constant";

import { REGISTRY_ABI } from "./viem-registry.abi";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";
import type { Address } from "viem";

export class ViemRegistryAdapter implements RegistryAdapter {
  constructor(private readonly publicClientFactor: ViemPublicClientFactory) {}

  async getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
    const { chainKey, owner } = query;

    const client = this.publicClientFactor.get(chainKey);
    const address = await this._getRegistryAddress(chainKey);
    const registry = getContract({ abi: REGISTRY_ABI, address, client });
    return await registry.read.nextNonce([owner]);
  }

  protected async _getRegistryAddress(chainKey: Chain): Promise<Address> {
    const { CHAIN_MASTER } = await import("@/infrastructure/masters/chain.master");
    return CHAIN_MASTER[chainKey].contracts.registry;
  }
}
