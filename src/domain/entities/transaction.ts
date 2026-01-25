import type { AmountUnitEntity } from "./common/amount-unit.entity";
import type { TokenInfoEntity } from "./common/token-info.entity";
import type { Address, Hex } from "viem";

export const TRANSACTION_DIRECTIONS = ["in", "out", "self"] as const;
export type TransferDirection = (typeof TRANSACTION_DIRECTIONS)[number];

export type TransactionEntity = {
  txHash: Hex;
  blockNumber: bigint;
  logIndex: number;
  token: TokenInfoEntity;
  direction: TransferDirection;
  value: AmountUnitEntity;
  counterparty: {
    address: Address;
  };
  transferredAt: Date;
};
