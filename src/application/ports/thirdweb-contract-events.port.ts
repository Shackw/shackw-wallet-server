import type { ThirdwebContractEventsResponseSchema } from "@/infrastructure/http/schemas/http-thirdweb-contract-events.schema";

import type * as v from "valibot";
import type { Address } from "viem";

export type ThirdwebContranctEventsContract = v.InferOutput<typeof ThirdwebContractEventsResponseSchema>;

export type ThirdwebContranctEventItemContract = ThirdwebContranctEventsContract["result"]["events"][number];

export type ThirdwebContranctEventsBaseQuery = {
  chainId: number;
  tokenAddress: Address;
  timestampLte: number;
  timestampGte: number;
  limit: number;
  page: number;
};

export type ThirdwebContranctEventsQuery = ThirdwebContranctEventsBaseQuery &
  ({ fromAddress: Address } | { toAddress: Address });

export interface ThirdwebContranctEventsGateway {
  fetch(query: ThirdwebContranctEventsQuery): Promise<ThirdwebContranctEventsContract>;
}
