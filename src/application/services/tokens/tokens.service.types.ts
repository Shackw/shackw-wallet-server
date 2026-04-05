import type { Chain } from "@/domain/constants/chain.constant";

import type { Authorization } from "viem";

export type TransferTokenInput = Readonly<{
  chainKey: Chain;
  quoteToken: string;
  authorization: Authorization;
}>;
