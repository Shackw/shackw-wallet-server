import type { EvmCallValueObject } from "./evm-call.value-object";
import type { Address } from "viem";

export type ExecutionIntentValueObject = Readonly<{
  chainId: number;
  sender: Address;
  calls: readonly EvmCallValueObject[];
  expiresAtSec: bigint;
  nonce: bigint;
}>;
