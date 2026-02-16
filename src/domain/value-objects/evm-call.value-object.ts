import type { Address, Hex } from "viem";

export type EvmCallValueObject = Readonly<{
  to: Address;
  value: bigint;
  data: Hex;
}>;
