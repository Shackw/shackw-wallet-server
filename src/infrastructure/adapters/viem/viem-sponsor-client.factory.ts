import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import type { Chain } from "@/domain/constants/chain.constant";
import { CHAIN_MASTER } from "@/infrastructure/masters/chain.master";

import type { Transport, WalletClient, Chain as ViemChain, Account, Address } from "viem";

export class ViemSponsorWalletClientFactory {
  private readonly cache = new Map<Chain, WalletClient<Transport, ViemChain, Account>>();

  async get(chainKey: Chain): Promise<WalletClient<Transport, ViemChain, Account>> {
    const hit = this.cache.get(chainKey);
    if (hit) return hit;

    const { viem: chain, rpcUrl } = CHAIN_MASTER[chainKey];

    const sponsorKey = await this._getSponsorPk(chainKey);
    const account = privateKeyToAccount(sponsorKey);
    const client = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl)
    });

    this.cache.set(chainKey, client);
    return client;
  }

  protected async _getSponsorPk(chainKey: Chain): Promise<Address> {
    const { SPONSOR_KEY_MASTER } = await import("@/infrastructure/masters/sponsor-key.master");
    return SPONSOR_KEY_MASTER[chainKey];
  }
}
