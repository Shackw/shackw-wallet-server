import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { ENV } from "@/config/env.config";
import type { Chain } from "@/domain/constants/chain.constant";
import { CHAIN_MASTER } from "@/infrastructure/masters/chain.master";

import type { Transport, WalletClient, Chain as ViemChain, Account } from "viem";

export class ViemSponsorWalletClientFactory {
  private readonly cache = new Map<Chain, WalletClient<Transport, ViemChain, Account>>();
  private readonly account = privateKeyToAccount(ENV.SPONSOR_PK);

  get(chainKey: Chain): WalletClient<Transport, ViemChain, Account> {
    const hit = this.cache.get(chainKey);
    if (hit) return hit;

    const { viem: chain, rpcUrl } = CHAIN_MASTER[chainKey];

    const client = createWalletClient({
      account: this.account,
      chain,
      transport: http(rpcUrl)
    });

    this.cache.set(chainKey, client);
    return client;
  }
}
