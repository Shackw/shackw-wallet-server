import { Module } from "@nestjs/common";

import { RpcV1Module } from "./v1/rpc-v1.module";

@Module({
  imports: [RpcV1Module]
})
export class RpcModule {}
