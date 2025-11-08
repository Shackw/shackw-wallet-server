import { createPublicClient, http } from "viem";

import { SUPPORT_CHAINS } from "@/config/chain.config";
import { CUSTOM_RPC_URLS } from "@/config/rpc-urls.config";

export const VIEM_PUBLIC_CLIENTS = {
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
  }),
  polygon: createPublicClient({
    chain: SUPPORT_CHAINS.polygon,
    transport: http(CUSTOM_RPC_URLS.polygon, {
      batch: {
        wait: 15,
        batchSize: 50
      },
      retryCount: 3,
      retryDelay: 250
    })
  })
};
