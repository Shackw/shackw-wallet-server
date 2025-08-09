import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { RpcV1Module } from "./v1/rpc-v1.module";
import { SendUserOperationService } from "./v1/services/send-user-operation.service";

@Module({
  imports: [RpcV1Module],
  providers: [
    SendUserOperationService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class RpcModule {}
