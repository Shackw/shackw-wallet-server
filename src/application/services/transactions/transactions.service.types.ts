import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

import type { Address } from "viem";

export type SearchTransactionsInput = Readonly<{
  chainKey: Chain;
  tokenSymbols: Token[];
  walletAddress: Address;
  timestampGte: number;
  timestampLte: number;
  searchDirection: "in" | "out" | "both";
  limit?: number | undefined;
}>;
