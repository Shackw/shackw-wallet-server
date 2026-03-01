import type { Chain } from "@/config/chain.config";

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
