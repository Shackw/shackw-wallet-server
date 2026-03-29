import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setupTestApp } from "@test/utils";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

describe("Transactions", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    ({ app, req } = await setupTestApp());
  });

  afterAll(() => app.close());

  describe("POST /v1/transactions:search", () => {
    const payload = {
      chain: "polygon",
      tokens: [{ symbol: "JPYC" }, { symbol: "USDC" }],
      wallet: "0x8ffb291d84fe98f2448beaa2a33104a618ea9ef8",
      timestampGte: 1764255600,
      timestampLte: 1764514800,
      direction: "out",
      limit: 1
    };

    it("should return transactions list with meta when payload is valid", async () => {
      // act
      const res = await req.post("/v1/transactions:search").send(payload);

      // assert
      expect(res.status).toBe(201);
      expect(res.body.meta).toEqual({ count: expect.any(Number) });
      expect(res.body.data[0]).toEqual({
        txHash: expect.any(String),
        blockNumber: expect.any(String),
        logIndex: expect.any(Number),
        token: {
          symbol: expect.any(String),
          address: expect.any(String),
          decimals: expect.any(Number)
        },
        direction: expect.any(String),
        value: {
          symbol: expect.any(String),
          minUnits: expect.any(String),
          decimals: expect.any(Number)
        },
        counterparty: { address: expect.any(String) },
        transferredAt: expect.any(String)
      });
    });

    it("should return 400 when chain is not in allowed values", async () => {
      // act
      const res = await req.post("/v1/fees:estimate").send({ ...payload, chain: "unknown chain" });

      // assert
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        errors: [
          {
            code: "BAD_REQUEST",
            message: expect.any(String)
          }
        ]
      });
    });

    it("should return 400 when token is not supported on the chain", async () => {
      // act
      const res = await req.post("/v1/fees:estimate").send({ ...payload, chain: "base" });

      // assert
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        errors: [
          {
            code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
            message: expect.any(String)
          }
        ]
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.post("/v1/fees:estimate").set("x-app-check-token", "").send(payload);

      // assert
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        statusCode: 401,
        errors: [
          {
            code: "UNAUTHORIZED",
            message: expect.any(String)
          }
        ]
      });
    });
  });
});
