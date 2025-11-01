import { InjectionToken } from "@nestjs/common";

import { Currency } from "@/registries/token.registry";

export type FetchExchangePayload = { base: Currency; symbol: Currency };

export interface ExchangeGateway {
  fetch(payload: FetchExchangePayload): Promise<number>;
}

export const EXCHANGE_GATEWAY: InjectionToken = Symbol("EXCHANGE_GATEWAY");
