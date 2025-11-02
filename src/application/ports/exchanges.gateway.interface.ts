import { InjectionToken } from "@nestjs/common";

import { Currency } from "@/registries/token.registry";

export const EXCHANGE_RATE_UNIT = 10_000n;

export type ExchangeRate = { rate: bigint; unit: typeof EXCHANGE_RATE_UNIT };

export type FetchExchangeRatePayload = { base: Currency; symbol: Currency };

export interface ExchangeGateway {
  fetchRate(payload: FetchExchangeRatePayload): Promise<ExchangeRate>;
}

export const EXCHANGE_GATEWAY: InjectionToken = Symbol("EXCHANGE_GATEWAY");
