import { Module } from "@nestjs/common";
import axios from "axios";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

import { ENV } from "@/config/env.config";
import { FIREBASE_CREDENTIAL } from "@/config/firebase.config";
import { MORALIS_BASE_URL } from "@/config/url.config";
import { FirebaseAppCheckAdapter } from "@/infrastructure/adapters/firebase/app-check";
import { ViemErc20Adapter } from "@/infrastructure/adapters/viem/erc20";
import { ViemRegistryAdapter } from "@/infrastructure/adapters/viem/registry";
import { ViemSponsorAdapter } from "@/infrastructure/adapters/viem/sponsor";
import { ViemPublicClientFactory } from "@/infrastructure/adapters/viem/viem-public-client.factory";
import { ViemSponsorWalletClientFactory } from "@/infrastructure/adapters/viem/viem-sponsor-client.factory";
import { HttpMoralisGateway } from "@/infrastructure/gateways/http/moralis";
import { StaticTokenDeploymentRepository } from "@/infrastructure/repositories/static/token-deployment";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

@Module({
  providers: [
    // factories
    ViemPublicClientFactory,
    ViemSponsorWalletClientFactory,

    // clients
    {
      provide: DI_TOKENS.FIREBASE_CLIENT,
      useValue:
        getApps().length > 0
          ? getApp()
          : initializeApp({
              credential: cert(FIREBASE_CREDENTIAL)
            })
    },

    // gateways
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
    {
      provide: DI_TOKENS.APP_CHECK_ADAPTER,
      useFactory: (app: App) => {
        const appCheck = getAppCheck(app);
        return new FirebaseAppCheckAdapter(appCheck);
      },
      inject: [DI_TOKENS.FIREBASE_CLIENT]
    },
    { provide: DI_TOKENS.ERC20_ADAPTER, useClass: ViemErc20Adapter },
    { provide: DI_TOKENS.REGISTRY_ADAPTER, useClass: ViemRegistryAdapter },
    { provide: DI_TOKENS.SPONSOR_ADAPTER, useClass: ViemSponsorAdapter },

    // repositories
    { provide: DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY, useClass: StaticTokenDeploymentRepository }
  ],
  exports: [
    DI_TOKENS.MORALIS_GATEWAY,
    DI_TOKENS.APP_CHECK_ADAPTER,
    DI_TOKENS.ERC20_ADAPTER,
    DI_TOKENS.REGISTRY_ADAPTER,
    DI_TOKENS.SPONSOR_ADAPTER,
    DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY
  ]
})
export class InfrastructureModule {}
