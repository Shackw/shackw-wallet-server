import { createPublicClient, http } from "viem";

import { DEFAULT_CHAIN } from "./chain.config";

export const VIEM_PUBLIC_CLIENT = createPublicClient({
  chain: DEFAULT_CHAIN,
  transport: http(undefined, {
    batch: {
      wait: 15,
      batchSize: 50
    },
    retryCount: 3,
    retryDelay: 250
  })
});
