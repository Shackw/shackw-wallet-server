import { Test } from "@nestjs/testing";
import request from "supertest";

import { BigIntToStringInterceptor } from "@/interfaces/common/interceptors/bigint-to-string.interceptor";
import { WrapDataInterceptor } from "@/interfaces/common/interceptors/wrap-data.interceptor";
import { AppModule } from "@/modules/app.module";

import type { Server } from "http";

export const makeMockObject = <T extends object>(overrides?: Partial<T>) =>
  ({
    ...overrides
  }) as unknown as T;

type OverrideProvider = {
  token: unknown;
  useValue: unknown;
};

export const setupTestApp = async (options?: { overrideProviders?: OverrideProvider[] }) => {
  const builder = Test.createTestingModule({
    imports: [AppModule]
  });

  for (const { token, useValue } of options?.overrideProviders ?? []) {
    builder.overrideProvider(token).useValue(useValue);
  }

  const moduleRef = await builder.compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalInterceptors(new WrapDataInterceptor(), new BigIntToStringInterceptor());
  app.setGlobalPrefix("v1");

  await app.init();
  const req = request.agent(app.getHttpServer() as Server).set("x-app-check-token", "dummy");

  return { app, req };
};
