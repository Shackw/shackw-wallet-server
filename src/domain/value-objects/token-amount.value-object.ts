import type { Token } from "@/config/token.config";

export type TokenAmountValueObject = {
  symbol: Token;
  minUnits: bigint;
  decimals: number;
};
