import * as v from "valibot";
import { getAddress, pad } from "viem";

import {
  InsightContranctEventsGateway,
  InsightContranctEventsQuery,
  InsightContranctEventsResult
} from "@/application/ports/insight-contract-events.gateway";
import { ENV } from "@/config/env.config";
import { InsightContractEventsResponseSchema } from "@/shared/validations/schemas/http-insight-contracr-events.schema";

import { restClient, RestClient } from "../http-clients/rest.client";

export class HttpInsightContractEventsGateway implements InsightContranctEventsGateway {
  private readonly client: RestClient;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.client = restClient;
    this.baseUrl = "https://api.thirdweb.com/v1/";
    this.apiKey = ENV.THIRD_WEB_API_SECRET;
  }

  async fetch(query: InsightContranctEventsQuery): Promise<InsightContranctEventsResult> {
    const { chainId, tokenAddress, timestampGte, timestampLte, limit, page } = query;

    const url = new URL(`/v1/contracts/${chainId}/${tokenAddress}/events`, this.baseUrl);

    url.searchParams.set("filterBlockTimestampGte", String(timestampGte));
    url.searchParams.set("filterBlockTimestampLte", String(timestampLte));
    url.searchParams.set("sortOrder", "desc");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("page", String(page));

    url.searchParams.set("filterTopic0", "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
    if ("fromAddress" in query) url.searchParams.set("filterTopic1", pad(getAddress(query.fromAddress), { size: 32 }));
    if ("toAddress" in query) url.searchParams.set("filterTopic2", pad(getAddress(query.toAddress), { size: 32 }));

    const headers: Record<string, string> = {
      accept: "application/json",
      "x-secret-key": this.apiKey
    };

    const fetched = await this.client.get(url.toString(), { headers });
    const parsed = v.parse(InsightContractEventsResponseSchema, fetched);

    return parsed;
  }
}
