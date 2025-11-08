import { Token } from "@/registries/token-chain.registry";

export type AmountUnit = {
  symbol: Token;
  minUnits: bigint;
  decimals: number;
};
