import { Module } from "@nestjs/common";

import { EXCHANGE_GATEWAY } from "@/application/ports/exchanges.gateway.interface";
import { HttpExchangeGateway } from "@/infrastructure/repositories/exchanges/http-exchange.gateway";

@Module({
  providers: [{ provide: EXCHANGE_GATEWAY, useClass: HttpExchangeGateway }],
  exports: [EXCHANGE_GATEWAY]
})
export class InfrastructureModule {}
