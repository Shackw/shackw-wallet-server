import type { Token } from "@/domain/constants/token.constant";

export type TokenAmountValueObject = {
  symbol: Token;
  minUnits: bigint;
  decimals: number;
};
