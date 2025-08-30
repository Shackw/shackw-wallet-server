import { BadGatewayException, Injectable, Logger } from "@nestjs/common";
import * as v from "valibot";

import { restClient } from "@/clients/restClient";

import { FetchExchangePayload, IExchangeGateway } from "./exchanges.gateway.interface";
import { FetchExchangeResponseSchema } from "./exchanges.gateway.parser";

@Injectable()
export class HttpExchangeGateway implements IExchangeGateway {
  private url = "https://api.frankfurter.dev/v1/latest";

  async fetch(payload: FetchExchangePayload): Promise<number> {
    try {
      const { base, symbol } = payload;

      const fetched = await restClient.get(this.url, { query: { base, symbols: symbol } });
      const parsed = v.parse(FetchExchangeResponseSchema, fetched);

      const rate = parsed.rates[symbol];
      if (!rate) throw new BadGatewayException(`No exchange rate available for ${base}/${symbol}.`);

      return rate;
    } catch (error) {
      Logger.error(error);
      throw new BadGatewayException("Failed to fetch exchange rate from the provider.");
    }
  }
}
