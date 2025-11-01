import { Address } from "viem";

import { Currency, Token } from "@/registries/token.registry";

export type FeeModel = {
  token: {
    symbol: Token;
    address: Address;
    decimals: number;
  };
  feeToken: {
    symbol: Token;
    address: Address;
    decimals: number;
  };
  feeMinUnits: bigint;
  feeDecimals: number;
  policy: {
    method: "bps_with_cap";
    version: "v1";
    bps: number;
    cap: {
      minUnit: bigint;
      currency: Currency;
    };
  };
};
