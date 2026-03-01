import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

import type { Address } from "viem";

export type SearchTransactionsInput = Readonly<{
  chainKey: Chain;
  tokenSymbols: Token[];
  walletAddress: Address;
  timestampGte: number;
  timestampLte: number;
  searchDirection: "in" | "out" | "both";
  limit?: number;
}>;
