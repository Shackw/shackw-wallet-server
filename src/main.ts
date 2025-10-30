import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as swaggerUi from "swagger-ui-express";

import { BigIntToStringInterceptor } from "@/interceptors/bigint-to-string.interceptor";
import { DateToIsoDateStringInterceptor } from "@/interceptors/data-to-iso-date-string.interceptor";

import { AppModule } from "./app.module";
import { openapi31 } from "./docs/openapi31.ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalInterceptors(new BigIntToStringInterceptor());

  app.useGlobalInterceptors(new DateToIsoDateStringInterceptor());

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapi31, {
      customSiteTitle: "Hinomaru Wallet API Docs"
    })
  );

  await app.listen(3000);
}
void bootstrap();
