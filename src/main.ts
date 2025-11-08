import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";

import { setupSwagger } from "./config/swagger.config";
import { WrapArrayInterceptor } from "./interfaces/interceptors/wrap-array.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new WrapArrayInterceptor());

  app.setGlobalPrefix("api");

  setupSwagger(app);

  await app.listen(3000);
}
void bootstrap();
