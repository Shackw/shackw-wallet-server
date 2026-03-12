import type { Chain } from "@/domain/constants/chain.constant";

import type { Address } from "viem";

// === Input ===
export type EnsureSufficientBalanceInput = Readonly<{
  chainKey: Chain;
  owner: Address;
  tokenAddress: Address;
  tokenRequiredMinUnits: bigint;
  feeTokenAddress: Address;
  feeRequiredMinUnits: bigint;
}>;
