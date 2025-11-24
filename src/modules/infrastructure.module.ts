import { Module } from "@nestjs/common";

import { HttpMorarisTokenTransfersGateway } from "@/infrastructure/http/http-moraris-token-transfers.gateway";
import { HttpThirdwebContractEventsGateway } from "@/infrastructure/http/http-thirdweb-contract-events.gateway";

@Module({
  providers: [
    {
      provide: "ThirdwebContractEventsGateway",
      useFactory: () => {
        return new HttpThirdwebContractEventsGateway();
      }
    },
    {
      provide: "MorarisTokenTransfersGateway",
      useFactory: () => {
        return new HttpMorarisTokenTransfersGateway();
      }
    }
  ],
  exports: ["ThirdwebContractEventsGateway", "MorarisTokenTransfersGateway"]
})
export class InfrastructureModule {}
