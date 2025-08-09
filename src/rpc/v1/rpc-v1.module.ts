import { Module } from "@nestjs/common";
import { Chain, createPublicClient, http, PublicClient } from "viem";

import { RpcController } from "./controllers/rpc.controller";
import { UserOperationService } from "./services/user-operation.service";
import { VIEM_PUBLIC_CLIENT, VIEM_CHAIN } from "./tokens";

@Module({
  controllers: [RpcController],
  providers: [
    {
      provide: VIEM_CHAIN,
      useFactory: () => ({
        id: Number(process.env.CHAIN_ID),
        name: process.env.CHAIN_NAME ?? "custom",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [process.env.RPC_URL as string] } }
      })
    },
    {
      provide: VIEM_PUBLIC_CLIENT,
      useFactory: (chain: Chain): PublicClient =>
        createPublicClient({
          chain,
          transport: http(chain.rpcUrls.default.http[0])
        }),
      inject: [VIEM_CHAIN]
    },
    UserOperationService
  ],
  exports: [VIEM_PUBLIC_CLIENT, VIEM_CHAIN]
})
export class RpcV1Module {}
