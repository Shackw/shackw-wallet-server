import type { Erc20Adapter, GetBalanceQuery } from "@/application/ports/adapters/erc20.adapter.port";

export class StubViemErc20Adap implements Erc20Adapter {
  getBalance(query: GetBalanceQuery): Promise<bigint> {
    if (query.owner === "0x") throw new Error();
    return Promise.resolve(100n);
  }
}
