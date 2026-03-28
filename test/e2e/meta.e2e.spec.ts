import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { BigIntToStringInterceptor } from "@/interfaces/common/interceptors/bigint-to-string.interceptor";
import { WrapDataInterceptor } from "@/interfaces/common/interceptors/wrap-data.interceptor";
import { AppModule } from "@/modules/app.module";

import type { INestApplication } from "@nestjs/common";
import type { Server } from "http";

describe("Meta", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(new WrapDataInterceptor(), new BigIntToStringInterceptor());
    app.setGlobalPrefix("v1");

    await app.init();
    req = request.agent(app.getHttpServer() as Server).set("x-app-check-token", "dummy");
  });

  afterAll(() => app.close());

  it("GET /v1/meta/chains should return chains meta", async () => {
    const res = await req.get("/v1/meta/chains");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({
      key: expect.any(String),
      id: expect.any(Number),
      testnet: expect.any(Boolean)
    });
  });

  it("GET /v1/meta/tokens should return tokens meta", async () => {
    const res = await req.get("/v1/meta/tokens");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({
      address: expect.any(Object),
      symbol: expect.any(String),
      decimals: expect.any(Number)
    });
  });

  it("GET /v1/meta/fees should return fees meta", async () => {
    const res = await req.get("/v1/meta/fees");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({
      chainKey: expect.any(String),
      tokenSymbol: expect.any(String),
      fixedFeeAmountUnits: expect.any(String),
      fixedFeeAmountDisplay: expect.any(Number)
    });
  });

  it("GET /v1/meta/min-transfers should return min transfers meta", async () => {
    const res = await req.get("/v1/meta/min-transfers");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({
      chainKey: expect.any(String),
      tokenSymbol: expect.any(String),
      minTransferAmountUnits: expect.any(String),
      minTransferAmountDisplay: expect.any(Number)
    });
  });

  it("GET /v1/meta/contracts should return contracts meta", async () => {
    const res = await req.get("/v1/meta/contracts");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      delegate: expect.any(Object),
      registry: expect.any(Object),
      sponsor: expect.any(Object)
    });
  });

  it("GET /v1/meta/summary should return meta summary", async () => {
    const res = await req.get("/v1/meta/summary");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      schemaVersion: expect.any(String),
      chains: expect.any(Array),
      tokens: expect.any(Array),
      fixedFees: expect.any(Array),
      minTransfers: expect.any(Array),
      contracts: expect.any(Object)
    });
  });
});
