import { Module } from "@nestjs/common";

import { ENV } from "@/config/env.config";
import { MemoryTokenDeploymentRepository } from "@/infrastructure/config/repositories/memory-token-deployment.repository";
import { ViemErc20Adapter } from "@/infrastructure/evm/adapters/viem-erc20.adapter";
import { ViemRegistryAdapter } from "@/infrastructure/evm/adapters/viem-registry.adapter";
import { ViemSponsorAdapter } from "@/infrastructure/evm/adapters/viem-sponsor.adapter";
import { SponsorWalletClientFactory } from "@/infrastructure/evm/client/sponsor-client.factory";
import { ViemPublicClientFactory } from "@/infrastructure/evm/client/viem-public-client.factory";
import type { HttpClient } from "@/infrastructure/http/client/http.client";
import { httpClient } from "@/infrastructure/http/client/http.client";
import { HttpMoralisTokenTransfersGateway } from "@/infrastructure/http/gateways/http-moralis-token-transfers.gateway";
import { HttpThirdwebContractEventsGateway } from "@/infrastructure/http/gateways/http-thirdweb-contract-events.gateway";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

const THIRDWEB_BASE_URL = "https://api.thirdweb.com";
const MORALIS_BASE_URL = "https://deep-index.moralis.io";

@Module({
  providers: [
    // factories
    ViemPublicClientFactory,
    SponsorWalletClientFactory,

    // http
    { provide: DI_TOKENS.HTTP_CLIENT, useValue: httpClient },

    // gateways
    {
      provide: DI_TOKENS.THIRDWEB_CONTRACT_EVENTS_GATEWAY,
      useFactory: (client: HttpClient) =>
        new HttpThirdwebContractEventsGateway(client, THIRDWEB_BASE_URL, ENV.THIRD_WEB_API_SECRET),
      inject: [DI_TOKENS.HTTP_CLIENT]
    },
    {
      provide: DI_TOKENS.MORALIS_TOKEN_TRANSFERS_GATEWAY,
      useFactory: (client: HttpClient) =>
        new HttpMoralisTokenTransfersGateway(client, MORALIS_BASE_URL, ENV.MORALIS_API_SECRET),
      inject: [DI_TOKENS.HTTP_CLIENT]
    },

    // adapters
    { provide: DI_TOKENS.ERC20_ADAPTER, useClass: ViemErc20Adapter },
    { provide: DI_TOKENS.REGISTRY_ADAPTER, useClass: ViemRegistryAdapter },
    { provide: DI_TOKENS.SPONSOR_ADAPTER, useClass: ViemSponsorAdapter },

    // repositories
    { provide: DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY, useClass: MemoryTokenDeploymentRepository }
  ],
  exports: [
    DI_TOKENS.THIRDWEB_CONTRACT_EVENTS_GATEWAY,
    DI_TOKENS.MORALIS_TOKEN_TRANSFERS_GATEWAY,
    DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY,
    DI_TOKENS.ERC20_ADAPTER,
    DI_TOKENS.REGISTRY_ADAPTER,
    DI_TOKENS.SPONSOR_ADAPTER
  ]
})
export class InfrastructureModule {}
