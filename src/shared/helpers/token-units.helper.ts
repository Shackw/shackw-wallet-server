import { formatUnits, parseUnits } from "viem/utils";

import { Token, TOKEN_REGISTRY } from "@/registries/token.registry";

export const toMinUnits = (amount: string | number, token: Token): bigint => {
  const { decimals } = TOKEN_REGISTRY[token];
  return parseUnits(String(amount), decimals);
};

export const toDecimals = (minUnits: bigint, token: Token): number => {
  return Number(formatUnits(minUnits, TOKEN_REGISTRY[token].decimals));
};
