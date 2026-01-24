import type { Token } from "@/registries/token-chain.registry";

import type { Address } from "viem";

export type TokenInfo = {
  symbol: Token;
  address: Address;
  decimals: number;
};
