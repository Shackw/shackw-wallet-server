import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

import type { Address } from "viem";

export type CreateQuoteInput = Readonly<{
  chainKey: Chain;
  sender: Address;
  recipient: Address;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;
