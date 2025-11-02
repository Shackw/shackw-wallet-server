import { Token } from "@/registries/token.registry";

export type AmountUnit = {
  symbol: Token;
  minUnits: bigint;
  decimals: number;
};
