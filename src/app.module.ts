import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ApiModule } from "api/api.module";
import { RpcModule } from "rpc/rpc.module";

@Module({
  imports: [ThrottlerModule.forRoot([{ name: "rpc", ttl: 60_000, limit: 60 }]), ApiModule, RpcModule]
})
export class AppModule {}
