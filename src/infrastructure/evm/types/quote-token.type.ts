import { Address, Hex } from "viem";

export type QuoteToken = {
  v: number;
  chainId: number;
  sender: Address;
  recipient: Address;
  token: Address;
  feeToken: Address;
  amountMinUnits: bigint;
  feeMinUnits: bigint;
  delegate: Address;
  sponsor: Address;
  expiresAt: bigint;
  nonce: bigint;
  callHash: Hex;
};
