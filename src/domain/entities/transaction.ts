import type { AmountUnit } from "./common/amount-unit.entity";
import type { TokenInfo } from "./common/token-info.entity";
import type { Address, Hex } from "viem";

export const TRANSACTION_DIRECTIONS = ["in", "out", "self"] as const;
export type TransferDirection = (typeof TRANSACTION_DIRECTIONS)[number];

export type TransactionModel = {
  txHash: Hex;
  blockNumber: bigint;
  logIndex: number;
  token: TokenInfo;
  direction: TransferDirection;
  value: AmountUnit;
  counterparty: {
    address: Address;
  };
  transferredAt: Date;
};
