import type { Token } from "@/registries/token-chain.registry";

export type AmountUnitEntity = {
  symbol: Token;
  minUnits: bigint;
  decimals: number;
};
