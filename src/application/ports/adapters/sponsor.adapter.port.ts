import type { Chain } from "@/domain/constants/chain.constant";
import type { EvmCallValueObject } from "@/domain/value-objects/evm-call.value-object";

import type { Address, Authorization, Hex } from "viem";

// === Queries ===
export type DelegateExecuteQuery = Readonly<{
  chainKey: Chain;
  sender: Address;
  calls: readonly EvmCallValueObject[];
  nonce: bigint;
  expiresAt: bigint;
  callHash: Hex;
  authorization: Authorization;
}>;

// === Abstract Port ===
export interface SponsorAdapter {
  simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void>;
  writeDelegateExecute(query: DelegateExecuteQuery): Promise<Hex>;
}
