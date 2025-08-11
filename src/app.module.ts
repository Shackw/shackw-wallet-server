import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { ApiModule } from "api/api.module";
import { EnvSchema } from "common/config/env.schema";
import { RpcModule } from "rpc/rpc.module";
import * as v from "valibot";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: "rpc", ttl: 60_000, limit: 60 }]),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: rawEnv => {
        const parsed = v.safeParse(EnvSchema, rawEnv);
        if (!parsed.success) throw new Error(parsed.issues.map(i => i.message).join(", "));
        return parsed.output;
      }
    }),
    ApiModule,
    RpcModule
  ]
})
export class AppModule {}
