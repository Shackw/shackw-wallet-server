import type { Chain } from "@/domain/constants/chain.constant";

import type { Address } from "viem";

// === Abstract ===
export abstract class BalanceSufficiencyPolicy {
  abstract ensure(input: EnsureSufficientBalanceInput): Promise<void>;
}

// === Input ===
export type EnsureSufficientBalanceInput = Readonly<{
  chainKey: Chain;
  owner: Address;
  tokenAddress: Address;
  tokenRequiredMinUnits: bigint;
  feeTokenAddress: Address;
  feeRequiredMinUnits: bigint;
}>;
