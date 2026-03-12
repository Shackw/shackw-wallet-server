import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/modules/app.module";

import { BigIntToStringInterceptor } from "./interfaces/common/interceptors/bigint-to-string.interceptor";
import { WrapDataInterceptor } from "./interfaces/common/interceptors/wrap-data.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      timestamp: true,
      logLevels: ["log", "warn", "error", "fatal"]
    })
  });

  app.useGlobalInterceptors(new WrapDataInterceptor());
  app.useGlobalInterceptors(new BigIntToStringInterceptor());

  app.setGlobalPrefix("v1");

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
