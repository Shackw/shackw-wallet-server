import { Address } from "viem";

import { Token } from "@/registries/token-chain.registry";

export type TokenInfo = {
  symbol: Token;
  address: Address;
  decimals: number;
};
