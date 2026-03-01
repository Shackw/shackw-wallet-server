import { Module } from "@nestjs/common";
import axios from "axios";

import { ENV } from "@/config/env.config";
import { MemoryTokenDeploymentRepository } from "@/infrastructure/config/repositories/memory-token-deployment.repository";
import { ViemErc20Adapter } from "@/infrastructure/evm/adapters/viem-erc20.adapter";
import { ViemRegistryAdapter } from "@/infrastructure/evm/adapters/viem-registry.adapter";
import { ViemSponsorAdapter } from "@/infrastructure/evm/adapters/viem-sponsor.adapter";
import { SponsorWalletClientFactory } from "@/infrastructure/evm/clients/sponsor-client.factory";
import { ViemPublicClientFactory } from "@/infrastructure/evm/clients/viem-public-client.factory";
import { HttpMoralisApiGateway } from "@/infrastructure/http/gateways/http-moralis-api.gateway";
import { HttpThirdwebApiGateway } from "@/infrastructure/http/gateways/http-thirdweb-api.gateway";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

const THIRDWEB_BASE_URL = "https://api.thirdweb.com";
const MORALIS_BASE_URL = "https://deep-index.moralis.io";

@Module({
  providers: [
    // factories
    ViemPublicClientFactory,
    SponsorWalletClientFactory,

    // gateways
    {
      provide: DI_TOKENS.THIRDWEB_API_GATEWAY,
      useFactory: () => {
        const client = axios.create({
          baseURL: THIRDWEB_BASE_URL,
          timeout: 10_000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-secret-key": ENV.THIRD_WEB_API_SECRET
          }
        });
        return new HttpThirdwebApiGateway(client);
      }
    },
    {
      provide: DI_TOKENS.MORALIS_API_GATEWAY,
      useFactory: () => {
        const client = axios.create({
          baseURL: MORALIS_BASE_URL,
          timeout: 10_000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-API-Key": ENV.MORALIS_API_SECRET
          }
        });
        return new HttpMoralisApiGateway(client);
      }
    },

    // adapters
    { provide: DI_TOKENS.ERC20_ADAPTER, useClass: ViemErc20Adapter },
    { provide: DI_TOKENS.REGISTRY_ADAPTER, useClass: ViemRegistryAdapter },
    { provide: DI_TOKENS.SPONSOR_ADAPTER, useClass: ViemSponsorAdapter },

    // repositories
    { provide: DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY, useClass: MemoryTokenDeploymentRepository }
  ],
  exports: [
    DI_TOKENS.THIRDWEB_API_GATEWAY,
    DI_TOKENS.MORALIS_API_GATEWAY,
    DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY,
    DI_TOKENS.ERC20_ADAPTER,
    DI_TOKENS.REGISTRY_ADAPTER,
    DI_TOKENS.SPONSOR_ADAPTER
  ]
})
export class InfrastructureModule {}
