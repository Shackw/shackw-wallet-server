import type { GetNextNonceQuery, RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";

export class StubRegistryAdapter implements RegistryAdapter {
  getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
    if (query.owner === "0x") throw new Error();
    return Promise.resolve(100n);
  }
}
