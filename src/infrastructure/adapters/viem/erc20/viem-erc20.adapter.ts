import { Inject } from "@nestjs/common";
import { getContract, erc20Abi } from "viem";

import type { Erc20Adapter, GetBalanceQuery } from "@/application/ports/adapters/erc20.adapter.port";

import { ViemPublicClientFactory } from "../viem-public-client.factory";

export class ViemErc20Adapter implements Erc20Adapter {
  constructor(
    @Inject(ViemPublicClientFactory)
    private readonly publicClientFactory: ViemPublicClientFactory
  ) {}

  async getBalance(query: GetBalanceQuery): Promise<bigint> {
    const { chainKey, tokenAddress: token, owner } = query;

    const client = this.publicClientFactory.get(chainKey);
    const erc20 = getContract({ abi: erc20Abi, address: token, client });
    return await erc20.read.balanceOf([owner]);
  }
}
