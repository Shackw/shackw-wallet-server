import type { Call } from "./call.type";
import type { Address, Hex } from "viem";

export type ExecutionIntent = Readonly<{
  chainId: number;
  sender: Address;
  delegate: Address;
  sponsor: Address;
  calls: readonly Call[];
  expiresAtSec: bigint;
  nonce32: Hex;
}>;
