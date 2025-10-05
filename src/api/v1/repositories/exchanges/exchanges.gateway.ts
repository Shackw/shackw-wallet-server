import { BadGatewayException, Injectable } from "@nestjs/common";
import * as v from "valibot";

import { restClient } from "@/clients/restClient";

import { FetchExchangePayload, IExchangeGateway } from "./exchanges.gateway.interface";
import { FetchExchangeResponseSchema } from "./exchanges.gateway.parser";

@Injectable()
export class HttpExchangeGateway implements IExchangeGateway {
  private url = "https://api.frankfurter.dev/v1/latest";

  async fetch(payload: FetchExchangePayload): Promise<number> {
    const { base, symbol } = payload;
    try {
      const fetched = await restClient.get(this.url, { query: { base, symbols: symbol } });
      const parsed = v.parse(FetchExchangeResponseSchema, fetched);

      const rate = parsed.rates[symbol];
      if (rate === undefined) throw new Error(`No exchange rate available.`);

      return rate;
    } catch (e) {
      throw new BadGatewayException(`Failed to fetch exchange rate for ${base}/${symbol}`, { cause: e });
    }
  }
}
