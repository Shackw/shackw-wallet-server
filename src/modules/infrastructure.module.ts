import { Module } from "@nestjs/common";

import { ENV } from "@/config/env.config";
import { HttpClient, httpClient } from "@/infrastructure/clients/http.client";
import { HttpMorarisTokenTransfersGateway } from "@/infrastructure/http/http-moraris-token-transfers.gateway";
import { HttpThirdwebContractEventsGateway } from "@/infrastructure/http/http-thirdweb-contract-events.gateway";

@Module({
  providers: [
    {
      provide: "HttpClient",
      useValue: httpClient
    },
    {
      provide: "ThirdwebContractEventsGateway",
      useFactory: (client: HttpClient) =>
        new HttpThirdwebContractEventsGateway(client, "https://api.thirdweb.com", ENV.THIRD_WEB_API_SECRET),
      inject: ["HttpClient"]
    },
    {
      provide: "MorarisTokenTransfersGateway",
      useFactory: (client: HttpClient) =>
        new HttpMorarisTokenTransfersGateway(client, "https://deep-index.moralis.io", ENV.MORARIS_API_SECRET),
      inject: ["HttpClient"]
    }
  ],
  exports: ["ThirdwebContractEventsGateway", "MorarisTokenTransfersGateway"]
})
export class InfrastructureModule {}
