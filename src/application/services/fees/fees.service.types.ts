import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

export type EstimateFeeInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;
