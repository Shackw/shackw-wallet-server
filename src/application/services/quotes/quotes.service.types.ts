import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

import type { Address } from "viem";

export type CreateQuoteInput = Readonly<{
  chainKey: Chain;
  sender: Address;
  recipient: Address;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;
