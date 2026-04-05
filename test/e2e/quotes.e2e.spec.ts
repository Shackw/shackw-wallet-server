import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setupTestApp } from "@test/utils";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

describe("Quotes", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    ({ app, req } = await setupTestApp());
  });

  afterAll(() => app.close());

  describe("POST /v1/quotes", () => {
    const payload = {
      chain: "polygon",
      sender: "0x8549E82239a88f463ab6E55Ad1895b629a00Def3",
      recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      token: {
        symbol: "JPYC"
      },
      feeToken: {
        symbol: "JPYC"
      },
      amountMinUnits: "100000000000000000000"
    };

    it("should return 201 with quote when payload is valid", async () => {
      // act
      const res = await req.post("/v1/quotes").send(payload);

      // assert
      expect(res.status).toBe(201);
      expect(res.body.data).toEqual({
        callHash: expect.any(String),
        chainId: expect.any(Number),
        nonce: expect.any(String),
        sender: payload.sender,
        recipient: payload.recipient,
        delegate: expect.any(String),
        sponsor: expect.any(String),
        quoteToken: expect.any(String),
        serverTime: expect.any(String),
        expiresAt: expect.any(String),
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
        amount: {
          symbol: payload.token.symbol,
          minUnits: payload.amountMinUnits,
          decimals: expect.any(Number)
        },
        fee: {
          symbol: payload.feeToken.symbol,
          minUnits: expect.any(String),
          decimals: expect.any(Number)
        },
        policy: {
          method: "fixed_by_chain",
          version: "v1",
          chainKey: payload.chain
        }
      });
    });

    it("should return 400 when sender is invalid address", async () => {
      // act
      const res = await req.post("/v1/quotes").send({ ...payload, sender: "invalid address" });

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

    it("should return 400 when sender has insufficient combined balance", async () => {
      // act
      const res = await req
        .post("/v1/quotes")
        .send({ ...payload, sender: "0x8ffb291d84fe98f2448beaa2a33104a618ea9ef8" });

      // assert
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        errors: [
          {
            code: "INSUFFICIENT_COMBINED_BALANCE",
            message: expect.any(String)
          }
        ]
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.post("/v1/quotes").set("x-app-check-token", "").send(payload);

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
