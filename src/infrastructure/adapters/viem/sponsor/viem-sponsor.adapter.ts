import type { DelegateExecuteQuery, SponsorAdapter } from "@/application/ports/adapters/sponsor.adapter.port";
import type { Chain } from "@/domain/constants/chain.constant";

import { DELEGATE_ABI } from "./viem-sponsor.abi";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";
import type { ViemSponsorWalletClientFactory } from "../viem-sponsor-client.factory";
import type { Address, Hex } from "viem";

export class ViemSponsorAdapter implements SponsorAdapter {
  constructor(
    private readonly publicClientFactor: ViemPublicClientFactory,

    private readonly walletClientFactory: ViemSponsorWalletClientFactory
  ) {}

  async simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void> {
    const { chainKey, sender, calls, nonce, expiresAt, callHash, authorization } = query;

    const client = this.publicClientFactor.get(chainKey);
    const account = await this._getSponsorAddress(chainKey);

    const tx = {
      account,
      abi: DELEGATE_ABI,
      address: sender,
      functionName: "execute",
      args: [calls, nonce, expiresAt, callHash],
      authorizationList: [authorization],
      value: 0n
    } as const;

    await client.simulateContract(tx);

    return;
  }

  async writeDelegateExecute(query: DelegateExecuteQuery): Promise<Hex> {
    const { chainKey, sender, calls, nonce, expiresAt, callHash, authorization } = query;

    const client = this.walletClientFactory.get(chainKey);
    const account = await this._getSponsorAddress(chainKey);

    const tx = {
      account,
      abi: DELEGATE_ABI,
      address: sender,
      functionName: "execute",
      args: [calls, nonce, expiresAt, callHash],
      authorizationList: [authorization],
      value: 0n
    } as const;

    return await client.writeContract(tx);
  }

  protected async _getSponsorAddress(chainKey: Chain): Promise<Address> {
    const { CHAIN_MASTER } = await import("@/infrastructure/masters/chain.master");
    return CHAIN_MASTER[chainKey].contracts.sponsor;
  }
}
