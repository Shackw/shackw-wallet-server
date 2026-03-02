import { getContract } from "viem";

import type { GetNextNonceQuery, RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";
import { CHAIN_MASTER } from "@/infrastructure/config/masters/chain.master";

import { REGISTRY_ABI } from "./viem-registry.abi";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";

export class ViemRegistryAdapter implements RegistryAdapter {
  constructor(private readonly publicClientFactor: ViemPublicClientFactory) {}

  async getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
    const { chainKey, owner } = query;

    const client = this.publicClientFactor.get(chainKey);
    const registry = getContract({ abi: REGISTRY_ABI, address: CHAIN_MASTER[chainKey].contracts.registry, client });
    return await registry.read.nextNonce([owner]);
  }
}
