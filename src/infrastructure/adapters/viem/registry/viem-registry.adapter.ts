import { Inject } from "@nestjs/common";
import { getContract } from "viem";

import type { GetNextNonceQuery, RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";

import { ViemPublicClientFactory } from "../viem-public-client.factory";

import { REGISTRY_ABI } from "./viem-registry.abi";

export class ViemRegistryAdapter implements RegistryAdapter {
  constructor(
    @Inject(ViemPublicClientFactory)
    private readonly publicClientFactory: ViemPublicClientFactory
  ) {}

  async getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
    const { registry: address, chainKey, owner } = query;

    const client = this.publicClientFactory.get(chainKey);
    const registry = getContract({ abi: REGISTRY_ABI, address, client });
    return await registry.read.nextNonce([owner]);
  }
}
