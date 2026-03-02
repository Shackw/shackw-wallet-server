import type { EvmCallValueObject } from "@/domain/value-objects/evm-call.value-object";

import type { Address, Hex } from "viem";

export type BuildErc20TransferCallInput = Readonly<{ token: Address; to: Address; amountMinUnits: bigint }>;

export type BuildExecutionIntentInput = Readonly<{
  chainId: number;
  sender: Address;
  recipient: Address;
  token: Address;
  amountMinUnits: bigint;
  feeToken: Address;
  sponsor: Address;
  feeMinUnits: bigint;
  nonce: bigint;
  expiresAtSec: bigint;
}>;

export type BuildExecutionIntentOutput = Readonly<{
  calls: readonly EvmCallValueObject[];
  callHash: Hex;
}>;
