import type { Chain } from "@/config/chain.config";

import type { Authorization } from "viem";

export type TransferTokenInput = Readonly<{
  chainKey: Chain;
  quoteToken: string;
  authorization: Authorization;
  notify?: {
    webhook: {
      id: string;
      url: string;
      echo: string;
    };
  };
}>;
