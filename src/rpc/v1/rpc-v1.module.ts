import { Module } from "@nestjs/common";

import { RpcController } from "./controllers/rpc.controller";
import { SendUserOperationService } from "./services/send-user-operation.service";

@Module({
  controllers: [RpcController],
  providers: [SendUserOperationService]
})
export class RpcV1Module {}
