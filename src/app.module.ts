import { Module } from "@nestjs/common";
import { ApiModule } from "api/api.module";
import { RpcModule } from "rpc/rpc.module";

@Module({
  imports: [ApiModule, RpcModule]
})
export class AppModule {}
