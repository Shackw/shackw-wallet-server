import { Currency } from "@/registries/token.registry";

export type FetchExchangePayload = { base: Currency; symbol: Currency };

export interface IExchangeGateway {
  fetch(payload: FetchExchangePayload): Promise<number>;
}
