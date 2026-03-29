import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setupTestApp } from "@test/utils";

import type { INestApplication } from "@nestjs/common";
import type request from "supertest";

describe("Tokens", () => {
  let app: INestApplication;
  let req: request.Agent;

  beforeAll(async () => {
    ({ app, req } = await setupTestApp());
  });

  afterAll(() => app.close());

  describe("GET /v1/meta/chains", () => {
    it("should return chains meta", async () => {
      const res = await req.get("/v1/meta/chains");
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toEqual({
        key: expect.any(String),
        id: expect.any(Number),
        testnet: expect.any(Boolean)
      });
    });
  });
});
