import type { ThirdwebContractEventsResponseSchema } from "@/shared/validations/schemas/http-thirdweb-contract-events.schema";

import type * as v from "valibot";
import type { Address } from "viem";

export interface ThirdwebContranctEventsGateway {
  fetch(query: ThirdwebContranctEventsQuery): Promise<ThirdwebContranctEventsResult>;
}

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

export type ThirdwebContranctEventItem = ThirdwebContranctEventsResult["result"]["events"][number];

export type ThirdwebContranctEventsResult = v.InferOutput<typeof ThirdwebContractEventsResponseSchema>;
