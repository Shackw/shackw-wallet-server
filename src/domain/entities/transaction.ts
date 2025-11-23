import { Address, Hex } from "viem";

import { AmountUnit } from "./common/amount-unit.entity";
import { TokenInfo } from "./common/token-info.entity";

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
