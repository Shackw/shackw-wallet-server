import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import type { Chain } from "@/domain/constants/chain.constant";
import { CHAIN_MASTER } from "@/infrastructure/masters/chain.master";

import type { Transport, WalletClient, Chain as ViemChain, Account, Address } from "viem";

export class ViemSponsorWalletClientFactory {
  private readonly cache = new Map<Chain, WalletClient<Transport, ViemChain, Account>>();

  get(chainKey: Chain): WalletClient<Transport, ViemChain, Account> {
    const hit = this.cache.get(chainKey);
    if (hit) return hit;

    const {
      viem: chain,
      rpcUrl,
      contracts: { sponsor }
    } = CHAIN_MASTER[chainKey];

    const account = privateKeyToAccount(sponsor);
    const client = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl)
    });

    this.cache.set(chainKey, client);
    return client;
  }

  protected async _getSponsorAddress(chainKey: Chain): Promise<Address> {
    const { CHAIN_MASTER } = await import("@/infrastructure/masters/chain.master");
    return CHAIN_MASTER[chainKey].contracts.sponsor;
  }
}
