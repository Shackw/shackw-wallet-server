import type { Address, Hex } from "viem";

export type Call = Readonly<{
  to: Address;
  value: bigint;
  data: Hex;
}>;
