import { Module } from "@nestjs/common";
import axios from "axios";

import { ENV } from "@/config/env.config";
import { ViemErc20Adapter } from "@/infrastructure/adapters/viem/erc20";
import { ViemRegistryAdapter } from "@/infrastructure/adapters/viem/registry";
import { ViemSponsorAdapter } from "@/infrastructure/adapters/viem/sponsor";
import { ViemPublicClientFactory } from "@/infrastructure/adapters/viem/viem-public-client.factory";
import { ViemSponsorWalletClientFactory } from "@/infrastructure/adapters/viem/viem-sponsor-client.factory";
import { HttpMoralisGateway } from "@/infrastructure/gateways/http/moralis";
import { HttpThirdwebApiGateway } from "@/infrastructure/gateways/http/thirdweb";
import { MemoryTokenDeploymentRepository } from "@/infrastructure/repositories/memory/token-deployment";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

const THIRDWEB_BASE_URL = "https://api.thirdweb.com";
const MORALIS_BASE_URL = "https://deep-index.moralis.io";

@Module({
  providers: [
    // factories
    ViemPublicClientFactory,
    ViemSponsorWalletClientFactory,

    // gateways
    {
      provide: DI_TOKENS.THIRDWEB_GATEWAY,
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
      provide: DI_TOKENS.MORALIS_GATEWAY,
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
        return new HttpMoralisGateway(client);
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
    DI_TOKENS.THIRDWEB_GATEWAY,
    DI_TOKENS.MORALIS_GATEWAY,
    DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY,
    DI_TOKENS.ERC20_ADAPTER,
    DI_TOKENS.REGISTRY_ADAPTER,
    DI_TOKENS.SPONSOR_ADAPTER
  ]
})
export class InfrastructureModule {}
