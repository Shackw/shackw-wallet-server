import type { Chain } from "@/config/chain.config";

import type { Address } from "viem";

// === Queries ===
export type GetBalanceQuery = Readonly<{ owner: Address; chainKey: Chain; tokenAddress: Address }>;

// === Abstract Port ===
export interface Erc20Adapter {
  getBalance(query: GetBalanceQuery): Promise<bigint>;
}
