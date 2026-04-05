import type { Token } from "@/domain/constants/token.constant";

import type { Address } from "viem";

export type TokenDescriptorValueObject = {
  symbol: Token;
  address: Address;
  decimals: number;
};
