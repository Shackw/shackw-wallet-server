import * as v from "valibot";

import {
  CHIAN_TO_MORARIS_CHAIN,
  MorarisTokenTransfersGateway,
  MorarisTokenTransfersQuery,
  MorarisTokenTransfersResult
} from "@/application/ports/moraris-token-transfers.gateway";
import { ENV } from "@/config/env.config";
import { MorarisTokenTransfersResponseSchema } from "@/shared/validations/schemas/http-moraris-token-transfer.shema";

import { restClient, RestClient } from "../http-clients/rest.client";

export class HttpMorarisTokenTransfersGateway implements MorarisTokenTransfersGateway {
  private readonly client: RestClient;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.client = restClient;
    this.baseUrl = "https://deep-index.moralis.io";
    this.apiKey = ENV.MORARIS_API_SECRET;
  }

  async fetch(query: MorarisTokenTransfersQuery): Promise<MorarisTokenTransfersResult> {
    const { chain, wallet, fromDate, toDate, tokenAddresses, limit, cursor } = query;

    const url = new URL(`/api/v2.2/${wallet}/erc20/transfers`, this.baseUrl);

    url.searchParams.set("chain", CHIAN_TO_MORARIS_CHAIN[chain]);
    url.searchParams.set("from_date", String(fromDate));
    url.searchParams.set("to_date", String(toDate));
    url.searchParams.set("order", "DESC");
    url.searchParams.set("limit", String(limit));
    if (cursor) url.searchParams.set("cursor", String(cursor));

    tokenAddresses.forEach((addr, i) => {
      url.searchParams.set(`contract_addresses[${i}]`, addr);
    });

    const headers: Record<string, string> = {
      accept: "application/json",
      "X-API-Key": this.apiKey
    };

    const fetched = await this.client.get(url.toString(), { headers });
    const parsed = v.parse(MorarisTokenTransfersResponseSchema, fetched);

    return parsed;
  }
}
