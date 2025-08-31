import { Address, Hex } from "viem";

import { Token } from "@/registries/token.registry";

export type QuoteModel = {
  quoteToken: string;
  expiresAt: Date;
  chainId: number;
  sender: Address;
  recipient: Address;
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
  amount: {
    minUnits: bigint;
    decimals: number;
  };
  fee: {
    minUnits: bigint;
    decimals: number;
  };
  delegate: Address;
  sponsor: Address;
  callHash: Hex;
  policy: {
    method: string;
    version: string;
    bps: number;
    cap: {
      minUnit: bigint;
      currency: any;
    };
  };
  serverTime: Date;
};
