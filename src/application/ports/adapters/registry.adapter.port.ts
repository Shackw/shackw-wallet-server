import type { Chain } from "@/domain/constants/chain.constant";

import type { Address } from "viem";

// === Queries ===
export type GetNextNonceQuery = Readonly<{
  registry: Address;
  chainKey: Chain;
  owner: Address;
}>;

// === Abstract Port ===
export interface RegistryAdapter {
  getNextNonce(query: GetNextNonceQuery): Promise<bigint>;
}
