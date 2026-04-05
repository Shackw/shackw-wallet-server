import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { setupTestApp } from "@test/utils";

import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

vi.mock("viem/utils", () => ({
  verifyAuthorization: vi.fn().mockResolvedValue(true)
}));

describe("Tokens", () => {
  let app: INestApplication;
  let req: request.Agent;

  const validQuotePayload = {
    chain: "polygon",
    sender: "0x8549E82239a88f463ab6E55Ad1895b629a00Def3",
    recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    token: { symbol: "JPYC" },
    feeToken: { symbol: "JPYC" },
    amountMinUnits: "100000000000000000000"
  };

  beforeAll(async () => {
    ({ app, req } = await setupTestApp({
      overrideProviders: [
        {
          token: DI_TOKENS.BALANCE_SUFFICIENCY_POLICY,
          useValue: { ensure: vi.fn().mockResolvedValue(undefined) }
        },
        {
          token: DI_TOKENS.SPONSOR_ADAPTER,
          useValue: {
            simulateDelegateExecute: vi.fn().mockResolvedValue(undefined),
            writeDelegateExecute: vi
              .fn()
              .mockResolvedValue("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef")
          }
        }
      ]
    }));
  });

  afterAll(() => app.close());

  describe("POST /v1/tokens:transfer", () => {
    it("should return 201 with txHash when transfer is valid", async () => {
      // arrange
      const quoteRes = await req.post("/v1/quotes").send(validQuotePayload);

      expect(quoteRes.status).toBe(201);
      const { quoteToken, chainId, delegate } = quoteRes.body.data;

      // act
      const res = await req.post("/v1/tokens:transfer").send({
        chain: "polygon",
        quoteToken,
        authorization: {
          address: delegate,
          chainId,
          nonce: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000001",
          s: "0x0000000000000000000000000000000000000000000000000000000000000001",
          yParity: 0
        }
      });

      // assert
      expect(res.status).toBe(201);
      expect(res.body.data).toEqual({
        status: "submitted",
        txHash: expect.any(String)
      });
    });

    it("should return 400 when quoteToken is invalid", async () => {
      // act
      const res = await req.post("/v1/tokens:transfer").send({
        chain: "polygon",
        quoteToken: "invalid.quote.token",
        authorization: {
          address: "0x0000000000000000000000000000000000000001",
          chainId: 137,
          nonce: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000001",
          s: "0x0000000000000000000000000000000000000000000000000000000000000001",
          yParity: 0
        }
      });

      // assert
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        errors: [{ code: "BAD_REQUEST", message: expect.any(String) }]
      });
    });

    it("should return 403 when authorization delegate does not match quoteToken", async () => {
      // arrange
      const quoteRes = await req.post("/v1/quotes").send(validQuotePayload);

      expect(quoteRes.status).toBe(201);
      const { quoteToken, chainId } = quoteRes.body.data;

      // act
      const res = await req.post("/v1/tokens:transfer").send({
        chain: "polygon",
        quoteToken,
        authorization: {
          address: "0x000000000000000000000000000000000000dead",
          chainId,
          nonce: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000001",
          s: "0x0000000000000000000000000000000000000000000000000000000000000001",
          yParity: 0
        }
      });

      // assert
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        statusCode: 403,
        errors: [{ code: "AUTHORIZATION_DELEGATE_MISMATCH", message: expect.any(String) }]
      });
    });

    it("should return 403 when authorization chainId does not match quoteToken", async () => {
      // arrange
      const quoteRes = await req.post("/v1/quotes").send(validQuotePayload);

      expect(quoteRes.status).toBe(201);
      const { quoteToken, delegate } = quoteRes.body.data;

      // act
      const res = await req.post("/v1/tokens:transfer").send({
        chain: "polygon",
        quoteToken,
        authorization: {
          address: delegate,
          chainId: 1,
          nonce: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000001",
          s: "0x0000000000000000000000000000000000000000000000000000000000000001",
          yParity: 0
        }
      });

      // assert
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        statusCode: 403,
        errors: [{ code: "AUTHORIZATION_CHAIN_MISMATCH", message: expect.any(String) }]
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req
        .post("/v1/tokens:transfer")
        .set("x-app-check-token", "")
        .send({
          chain: "polygon",
          quoteToken: "dummy",
          authorization: {
            address: "0x0000000000000000000000000000000000000001",
            chainId: 137,
            nonce: 0,
            r: "0x0000000000000000000000000000000000000000000000000000000000000001",
            s: "0x0000000000000000000000000000000000000000000000000000000000000001",
            yParity: 0
          }
        });

      // assert
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        statusCode: 401,
        errors: [{ code: "UNAUTHORIZED", message: expect.any(String) }]
      });
    });
  });
});
