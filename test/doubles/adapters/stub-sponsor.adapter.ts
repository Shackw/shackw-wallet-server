import type { DelegateExecuteQuery, SponsorAdapter } from "@/application/ports/adapters/sponsor.adapter.port";

import type { Hex } from "viem";

export class StubSponsorAdapter implements SponsorAdapter {
  simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void> {
    if (query.sender === "0x") return Promise.reject(new Error());
    return Promise.resolve();
  }
  writeDelegateExecute(query: DelegateExecuteQuery): Promise<Hex> {
    if (query.sender === "0x") return Promise.reject(new Error());
    return Promise.resolve("0x");
  }
}
