import { createPublicClient, http } from "viem";

import { SupportChain, SUPPORT_CHAINS } from "@/config/chain.config";
import { CUSTOM_RPC_URLS } from "@/config/rpc-urls.config";

export const VIEM_PUBLIC_CLIENTS: Record<SupportChain, ReturnType<typeof createPublicClient>> = {
  main: createPublicClient({
    chain: SUPPORT_CHAINS.main,
    transport: http(CUSTOM_RPC_URLS.main, {
      batch: {
        wait: 15,
        batchSize: 50
      },
      retryCount: 3,
      retryDelay: 250
    })
  }),
  base: createPublicClient({
    chain: SUPPORT_CHAINS.base,
    transport: http(CUSTOM_RPC_URLS.base, {
      batch: {
        wait: 15,
        batchSize: 50
      },
      retryCount: 3,
      retryDelay: 250
    })
  })
};
