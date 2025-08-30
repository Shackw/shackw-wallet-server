import { Provider } from "@nestjs/common";

import { HttpExchangeGateway } from "../repositories/exchanges/exchanges.gateway";

export const EXCHANGE_GATEWAY = Symbol("EXCHANGE_GATEWAY");

export const repositoriesProviders: Provider[] = [{ provide: EXCHANGE_GATEWAY, useClass: HttpExchangeGateway }];
