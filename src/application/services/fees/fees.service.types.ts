import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

export type EstimateFeeInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;
