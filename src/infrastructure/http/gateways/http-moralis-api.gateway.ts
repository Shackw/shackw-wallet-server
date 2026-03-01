import * as v from "valibot";

import type {
  MoralisApiGateway,
  MoralisSearchTransfersContract,
  MoralisSearchTransfersQuery
} from "@/application/ports/http/moralis-api.gateway.port";

import {
  APP_CHIAN_TO_MORARIS_CHAIN_MAP,
  APP_SORT_ORDER_TO_MORALIS_SORT_ORDER,
  MoralisSearchTransfersResponseExternalSchema
} from "../externals/moralis-api.external";
import { toMoralisSearchTransfersContract } from "../mappers/moralis-api.response-to-contract";

import type {
  MoralisSearchTransfersRequestExternal,
  MoralisSearchTransfersResponseExternal
} from "../externals/moralis-api.external";
import type { AxiosInstance } from "axios";
import type { Address } from "viem";

export class HttpMoralisApiGateway implements MoralisApiGateway {
  constructor(private client: AxiosInstance) {}

  async searchTransfers(query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
    const { chain, tokenAddresses, wallet, timestampGte, timestampLte, sortOrder } = query;

    const contAddrs = tokenAddresses.reduce<Record<`contract_addresses[${number}]`, Address>>((acc, addr, idx) => {
      acc[`contract_addresses[${idx}]`] = addr;
      return acc;
    }, {});

    const payload: MoralisSearchTransfersRequestExternal = {
      wallet,
      params: {
        chain: APP_CHIAN_TO_MORARIS_CHAIN_MAP[chain],
        from_date: timestampGte,
        to_date: timestampLte,
        order: APP_SORT_ORDER_TO_MORALIS_SORT_ORDER[sortOrder],
        limit: 100,
        ...contAddrs
      }
    };

    const fetcheds = await this._fetchTransfersByWallet(payload, []);
    return fetcheds.map(toMoralisSearchTransfersContract);
  }

  protected async _fetchTransfersByWallet(
    payload: MoralisSearchTransfersRequestExternal,
    results: MoralisSearchTransfersResponseExternal["result"]
  ): Promise<MoralisSearchTransfersResponseExternal["result"]> {
    const { wallet, params } = payload;

    const res = await this.client.get(`/api/v2.2/${wallet}/erc20/transfers`, { params });
    const { cursor, result } = v.parse(MoralisSearchTransfersResponseExternalSchema, res.data);

    results.push(...result);
    if (cursor) return this._fetchTransfersByWallet({ ...payload, params: { ...payload.params, cursor } }, result);

    return results;
  }
}
