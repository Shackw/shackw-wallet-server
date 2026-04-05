import { createPublicClient, http } from "viem";

import type { Chain } from "@/domain/constants/chain.constant";
import { CHAIN_MASTER } from "@/infrastructure/masters/chain.master";

import type { PublicClient } from "viem";

export class ViemPublicClientFactory {
  private readonly cache = new Map<Chain, PublicClient>();

  get(chainKey: Chain): PublicClient {
    const hit = this.cache.get(chainKey);
    if (hit) return hit;

    const { viem: chain, rpcUrl } = CHAIN_MASTER[chainKey];

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl)
    }) as PublicClient;

    this.cache.set(chainKey, client);
    return client;
  }
}
