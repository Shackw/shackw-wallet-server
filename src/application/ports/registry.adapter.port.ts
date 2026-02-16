import type { Chain } from "@/config/chain.config";

import type { Address } from "viem";

// === Queries ===
export type GetNextNonceQuery = Readonly<{
  chainKey: Chain;
  owner: Address;
}>;

// === Abstract Port ===
export interface RegistryAdapter {
  getNextNonce(query: GetNextNonceQuery): Promise<bigint>;
}
