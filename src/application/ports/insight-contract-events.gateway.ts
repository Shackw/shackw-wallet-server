import * as v from "valibot";
import { Address } from "viem";

import { InsightContractEventsResponseSchema } from "@/shared/validations/schemas/http-insight-contracr-events.schema";

export interface InsightContranctEventsGateway {
  fetch(query: InsightContranctEventsQuery): Promise<InsightContranctEventsResult>;
}

export type InsightContranctEventsBaseQuery = {
  chainId: number;
  tokenAddress: Address;
  timestampLte: number;
  timestampGte: number;
  limit: number;
  page: number;
};

export type InsightContranctEventsQuery = InsightContranctEventsBaseQuery &
  ({ fromAddress: Address } | { toAddress: Address });

export type InsightContranctEventItem = InsightContranctEventsResult["result"]["events"][number];

export type InsightContranctEventsResult = v.InferOutput<typeof InsightContractEventsResponseSchema>;
