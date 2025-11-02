import { BadGatewayException, Injectable } from "@nestjs/common";
import * as v from "valibot";

import {
  EXCHANGE_RATE_UNIT,
  ExchangeGateway,
  FetchExchangeRatePayload,
  ExchangeRate
} from "@/application/ports/exchanges.gateway.interface";
import { restClient } from "@/infrastructure/http-clients/rest.client";

import { FetchExchangeResponseSchema } from "./http-exchange.gateway.parser";

@Injectable()
export class HttpExchangeGateway implements ExchangeGateway {
  private url = "https://api.frankfurter.dev/v1/latest";

  async fetchRate(payload: FetchExchangeRatePayload): Promise<ExchangeRate> {
    const { base, symbol } = payload;
    const unit = EXCHANGE_RATE_UNIT;

    if (base === symbol) return { rate: EXCHANGE_RATE_UNIT, unit };

    try {
      const fetched = await restClient.get(this.url, { query: { base, symbols: symbol } });
      const parsed = v.parse(FetchExchangeResponseSchema, fetched);

      const rateNumber = parsed.rates[symbol];
      if (rateNumber === undefined) throw new Error(`No exchange rate available.`);

      const rate = BigInt(Math.round(rateNumber * Number(EXCHANGE_RATE_UNIT)));

      return { rate, unit };
    } catch (e) {
      throw new BadGatewayException(`Failed to fetch exchange rate for ${base}/${symbol}`, { cause: e });
    }
  }
}
