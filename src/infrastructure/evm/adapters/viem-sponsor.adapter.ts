import type { DelegateExecuteQuery, SponsorAdapter } from "@/application/ports/sponsor.adapter.port";
import { ENV } from "@/config/env.config";

import { DELEGATE_ABI } from "../abis/delegate.abi";

import type { SponsorWalletClientFactory } from "../client/sponsor-client.factory";
import type { ViemPublicClientFactory } from "../client/viem-public-client.factory";
import type { Hex } from "viem";

export class ViemSponsorAdapter implements SponsorAdapter {
  constructor(
    private readonly publicClientFactor: ViemPublicClientFactory,

    private readonly walletClientFactory: SponsorWalletClientFactory
  ) {}

  async simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void> {
    const { chainKey, sender, calls, nonce, expiresAt, callHash, authorization } = query;

    const client = this.publicClientFactor.get(chainKey);

    const tx = {
      account: ENV.SPONSOR_ADDRESS,
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

    const tx = {
      account: ENV.SPONSOR_ADDRESS,
      abi: DELEGATE_ABI,
      address: sender,
      functionName: "execute",
      args: [calls, nonce, expiresAt, callHash],
      authorizationList: [authorization],
      value: 0n
    } as const;

    return await client.writeContract(tx);
  }
}
