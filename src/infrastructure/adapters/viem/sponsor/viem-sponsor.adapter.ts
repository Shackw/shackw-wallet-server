import { Inject } from "@nestjs/common";

import type { DelegateExecuteQuery, SponsorAdapter } from "@/application/ports/adapters/sponsor.adapter.port";

import { ViemPublicClientFactory } from "../viem-public-client.factory";
import { ViemSponsorWalletClientFactory } from "../viem-sponsor-client.factory";

import { DELEGATE_ABI } from "./viem-sponsor.abi";

import type { Hex } from "viem";

export class ViemSponsorAdapter implements SponsorAdapter {
  constructor(
    @Inject(ViemPublicClientFactory)
    private readonly publicClientFactory: ViemPublicClientFactory,

    @Inject(ViemSponsorWalletClientFactory)
    private readonly walletClientFactory: ViemSponsorWalletClientFactory
  ) {}

  async simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void> {
    const { chainKey, ...rest } = query;

    const client = this.publicClientFactory.get(chainKey);

    const tx = this._buildTx(rest);

    await client.simulateContract(tx);

    return;
  }

  async writeDelegateExecute(query: DelegateExecuteQuery): Promise<Hex> {
    const { chainKey, ...rest } = query;

    const client = await this.walletClientFactory.get(chainKey);

    if (client.account.address.toLowerCase() !== rest.sponsor.toLowerCase())
      throw new Error("Sponsor address does not match the wallet account.");

    const tx = this._buildTx(rest);

    return await client.writeContract({ ...tx, account: client.account });
  }

  private _buildTx({
    sponsor,
    sender,
    calls,
    nonce,
    expiresAt,
    callHash,
    authorization
  }: Omit<DelegateExecuteQuery, "chainKey">) {
    return {
      account: sponsor,
      abi: DELEGATE_ABI,
      address: sender,
      functionName: "execute",
      args: [calls, nonce, expiresAt, callHash],
      authorizationList: [authorization],
      value: 0n
    } as const;
  }
}
