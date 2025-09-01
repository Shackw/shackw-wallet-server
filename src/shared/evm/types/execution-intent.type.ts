import type { Call } from "./call.type";
import type { Address } from "viem";

export type ExecutionIntent = Readonly<{
  chainId: number;
  sender: Address;
  calls: readonly Call[];
  expiresAtSec: bigint;
  nonce: bigint;
}>;
