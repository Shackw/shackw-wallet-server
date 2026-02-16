import type { Token } from "@/config/token.config";

import type { Address } from "viem";

export type TokenDescriptorValueObject = {
  symbol: Token;
  address: Address;
  decimals: number;
};
