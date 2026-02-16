import { getContract, erc20Abi } from "viem";

import type { Erc20Adapter, GetBalanceQuery } from "@/application/ports/erc20.adapter.port";

import type { ViemPublicClientFactory } from "../client/viem-public-client.factory";

export class ViemErc20Adapter implements Erc20Adapter {
  constructor(private readonly publicClientFactor: ViemPublicClientFactory) {}

  async getBalance(query: GetBalanceQuery): Promise<bigint> {
    const { chainKey, tokenAddress: token, owner } = query;

    const client = this.publicClientFactor.get(chainKey);
    const erc20 = getContract({ abi: erc20Abi, address: token, client });
    return await erc20.read.balanceOf([owner]);
  }
}
