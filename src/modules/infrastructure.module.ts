import { Module } from "@nestjs/common";

import { HttpInsightContractEventsGateway } from "@/infrastructure/http/http-insight-contracr-events.gateway";

@Module({
  providers: [
    {
      provide: "InsightWalletTransactionsGateway",
      useFactory: () => {
        return new HttpInsightContractEventsGateway();
      }
    }
  ],
  exports: ["InsightWalletTransactionsGateway"]
})
export class InfrastructureModule {}
