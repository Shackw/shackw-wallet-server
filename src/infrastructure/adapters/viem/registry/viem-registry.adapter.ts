import { getContract } from "viem";

import type { GetNextNonceQuery, RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";

import { REGISTRY_ABI } from "./viem-registry.abi";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";

export class ViemRegistryAdapter implements RegistryAdapter {
  constructor(private readonly publicClientFactor: ViemPublicClientFactory) {}

  async getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
    const { registry: address, chainKey, owner } = query;

    const client = this.publicClientFactor.get(chainKey);
    const registry = getContract({ abi: REGISTRY_ABI, address, client });
    return await registry.read.nextNonce([owner]);
  }
}
