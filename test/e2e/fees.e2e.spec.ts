import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setupTestApp } from "@test/utils";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

describe("Fees", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    ({ app, req } = await setupTestApp());
  });

  afterAll(() => app.close());

  describe("POST /v1/fees:estimate", () => {
    const payload = {
      chain: "mainnet",
      token: {
        symbol: "JPYC"
      },
      feeToken: {
        symbol: "USDC"
      },
      amountMinUnits: "1000000000000000000000"
    };

    it("should return 200 with fee estimation when payload is valid", async () => {
      // act
      const res = await req.post("/v1/fees:estimate").send(payload);

      // assert
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        token: {
          symbol: payload.token.symbol,
          address: expect.any(String),
          decimals: expect.any(Number)
        },
        feeToken: {
          symbol: payload.feeToken.symbol,
          address: expect.any(String),
          decimals: expect.any(Number)
        },
        amount: { symbol: payload.token.symbol, minUnits: expect.any(String), decimals: expect.any(Number) },
        fee: { symbol: payload.feeToken.symbol, minUnits: expect.any(String), decimals: expect.any(Number) },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: payload.chain }
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
