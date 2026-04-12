import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/modules/app.module";

import { HttpExceptionsFilter } from "./interfaces/common/filters/http-exception.filter";
import { BigIntToStringInterceptor } from "./interfaces/common/interceptors/bigint-to-string.interceptor";
import { LoggingInterceptor } from "./interfaces/common/interceptors/logging.interceptor";
import { WrapDataInterceptor } from "./interfaces/common/interceptors/wrap-data.interceptor";
import { CustomLogger } from "./shared/custom-logger";

async function bootstrap() {
  const logger = new CustomLogger({
    json: true,
    timestamp: true,
    logLevels: ["log", "warn", "error", "fatal"]
  });

  const filter = new HttpExceptionsFilter(logger);

  const app = await NestFactory.create(AppModule, {
    logger
  });

  app.useGlobalInterceptors(new LoggingInterceptor(logger), new WrapDataInterceptor(), new BigIntToStringInterceptor());
  app.useGlobalFilters(filter);
  app.setGlobalPrefix("v1");

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
