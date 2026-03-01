import * as v from "valibot";

import type {
  ThirdwebApiGateway,
  ThirdwebSearchContractEventsContract,
  ThirdwebSearchContractEventsQuery
} from "@/application/ports/http/thirdweb-api.gateway.por";

import {
  ThirdwebSearchContractEventsResponseExternalSchema,
  type ThirdwebSearchContractEventsRequestExternal,
  type ThirdwebSearchContractEventsResponseExternal
} from "../externals/thirdweb-api.external";
import { toThirdwebSearchContractEventsContract } from "../mappers/thirdweb-api.response-to-contract";

import type { AxiosInstance } from "axios";

export class HttpThirdwebApiGateway implements ThirdwebApiGateway {
  constructor(private client: AxiosInstance) {}

  async searchContractEvents(
    query: ThirdwebSearchContractEventsQuery
  ): Promise<ThirdwebSearchContractEventsContract[]> {
    const { chainId, fromAddress, toAddress, tokenAddresses, timestampGte, timestampLte, sortOrder } = query;

    const promises = await Promise.all(
      tokenAddresses
        .map(addr => {
          const filterTopic0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
          const filterTopic1 = fromAddress ? query.fromAddress : undefined;
          const filterTopic2 = toAddress ? query.toAddress : undefined;

          const base: ThirdwebSearchContractEventsRequestExternal = {
            chainId,
            tokenAddress: addr,
            params: {
              filterBlockTimestampGte: timestampGte,
              filterBlockTimestampLte: timestampLte,
              sortOrder,
              limit: 100,
              page: 1,
              filterTopic0
            }
          };
          const payloads: ThirdwebSearchContractEventsRequestExternal[] = [
            ...(filterTopic1 ? [{ ...base, params: { ...base.params, filterTopic1 } }] : []),
            ...(filterTopic2 ? [{ ...base, params: { ...base.params, filterTopic2 } }] : [])
          ];
          return payloads.map(p => this._fetchContractEventsByToken(p, []));
        })
        .flat()
    );
    const fetcheds = promises.flat();

    const uniques = Object.values(
      fetcheds.reduce<Record<string, ThirdwebSearchContractEventsResponseExternal["result"]["events"][number]>>(
        (acc, fetched) => {
          const key = `${fetched.transactionHash}:${fetched.logIndex}:${fetched.blockNumber}`;
          acc[key] = fetched;
          return acc;
        },
        {}
      )
    );

    const sorteds = uniques.sort((a, b) => {
      const sign = sortOrder === "asc" ? 1 : -1;

      const t = a.blockTimestamp.getTime() - b.blockTimestamp.getTime();
      if (t !== 0) return t * sign;

      if (a.blockNumber !== b.blockNumber) return (a.blockNumber > b.blockNumber ? 1 : -1) * sign;

      return (a.logIndex - b.logIndex) * sign;
    });

    return sorteds.map(toThirdwebSearchContractEventsContract);
  }

  protected async _fetchContractEventsByToken(
    payload: ThirdwebSearchContractEventsRequestExternal,
    results: ThirdwebSearchContractEventsResponseExternal["result"]["events"]
  ): Promise<ThirdwebSearchContractEventsResponseExternal["result"]["events"]> {
    const { chainId, tokenAddress, params } = payload;

    const res = await this.client.get(`/v1/contracts/${chainId}/${tokenAddress}/events`, { params });
    const {
      result: { events, pagination }
    } = v.parse(ThirdwebSearchContractEventsResponseExternalSchema, res.data);

    results.push(...events);
    if (pagination.page * pagination.limit < pagination.totalCount)
      return this._fetchContractEventsByToken(
        {
          ...payload,
          params: { ...payload.params, page: payload.params.page++ }
        },
        results
      );

    return results;
  }
}
