import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setupTestApp } from "@test/utils";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

describe("Meta", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    ({ app, req } = await setupTestApp());
  });

  afterAll(() => app.close());

  describe("GET /v1/meta/chains", () => {
    it("should return a list of supported chains", async () => {
      // act
      const res = await req.get("/v1/meta/chains");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.meta).toEqual({ count: expect.any(Number) });
      expect(res.body.data[0]).toEqual({
        key: expect.any(String),
        id: expect.any(Number),
        testnet: expect.any(Boolean)
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/chains").set("x-app-check-token", "");

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

  describe("GET /v1/meta/tokens", () => {
    it("should return a list of supported tokens", async () => {
      // act
      const res = await req.get("/v1/meta/tokens");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.meta).toEqual({ count: expect.any(Number) });
      expect(res.body.data[0]).toEqual({
        address: expect.any(Object),
        symbol: expect.any(String),
        decimals: expect.any(Number)
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/tokens").set("x-app-check-token", "");

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

  describe("GET /v1/meta/fees", () => {
    it("should return a list of fee policies per chain and token", async () => {
      // act
      const res = await req.get("/v1/meta/fees");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.meta).toEqual({ count: expect.any(Number) });
      expect(res.body.data[0]).toEqual({
        chainKey: expect.any(String),
        tokenSymbol: expect.any(String),
        fixedFeeAmountUnits: expect.any(String),
        fixedFeeAmountDisplay: expect.any(Number)
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/fees").set("x-app-check-token", "");

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

  describe("GET /v1/meta/min-transfers", () => {
    it("should return a list of minimum transfer amounts per chain and token", async () => {
      // act
      const res = await req.get("/v1/meta/min-transfers");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.meta).toEqual({ count: expect.any(Number) });
      expect(res.body.data[0]).toEqual({
        chainKey: expect.any(String),
        tokenSymbol: expect.any(String),
        minTransferAmountUnits: expect.any(String),
        minTransferAmountDisplay: expect.any(Number)
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/min-transfers").set("x-app-check-token", "");

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

  describe("GET /v1/meta/contracts", () => {
    it("should return contract addresses", async () => {
      // act
      const res = await req.get("/v1/meta/contracts");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        delegate: expect.any(Object),
        registry: expect.any(Object),
        sponsor: expect.any(Object)
      });
    });

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/contracts").set("x-app-check-token", "");

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

  describe("GET /v1/meta/summary", () => {
    it("should return all meta combined", async () => {
      // act
      const res = await req.get("/v1/meta/summary");

      // assert
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

    it("should return 401 when x-app-check-token is invalid", async () => {
      // act
      const res = await req.get("/v1/meta/summary").set("x-app-check-token", "");

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
