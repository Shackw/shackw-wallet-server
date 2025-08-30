import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { BigIntToStringInterceptor } from "@/interceptors/bigint-to-string.interceptor";

import { AppModule } from "./app.module";

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

  await app.listen(3000);
}
void bootstrap();
