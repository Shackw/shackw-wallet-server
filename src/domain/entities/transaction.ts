import type { TokenAmountValueObject } from "../value-objects/token-amount.value-object";
import type { TokenDescriptorValueObject } from "../value-objects/token-descriptor.value-object";
import type { Address, Hex } from "viem";

export const TRANSACTION_DIRECTIONS = ["in", "out", "self"] as const;
export type TransferDirection = (typeof TRANSACTION_DIRECTIONS)[number];

export type TransactionEntity = {
  txHash: Hex;
  blockNumber: bigint;
  logIndex: number;
  token: TokenDescriptorValueObject;
  direction: TransferDirection;
  value: TokenAmountValueObject;
  counterparty: {
    address: Address;
  };
  transferredAt: Date;
};
