import { describe, it, expect } from "vitest";

import { makeMockObject } from "@test/utils";

import type { AppCheckVerifyTokenQuery } from "@/application/ports/adapters/app-check.adapter.port";

import { FirebaseAppCheckAdapter } from "./firebase-app-check.adpter";

import type { AppCheck, DecodedAppCheckToken } from "firebase-admin/app-check";

describe("FirebaseAppCheckAdapter", () => {
  describe("verifyToken", () => {
    it("should throw an error when an invalid App Check token is provided", async () => {
      // arrange
      const originalEnv = process.env;

      process.env.NODE_ENV = "production";
      const expectedToken = "app-check-token";

      const client = makeMockObject<AppCheck>({
        verifyToken(token) {
          expect(token).toBe(expectedToken);

          return Promise.reject(new Error("on error when verifying token"));
        }
      });
      const appCheckAdapter = new FirebaseAppCheckAdapter(client);

      const query: AppCheckVerifyTokenQuery = { token: expectedToken };

      // act & assert
      await expect(appCheckAdapter.verifyToken(query)).rejects.toThrow(new Error("on error when verifying token"));

      // teardown
      process.env = { ...originalEnv };
    });

    it("should succeed when an valid App Check token is provided", async () => {
      // arrange
      const expectedToken = "app-check-token";

      const client = makeMockObject<AppCheck>({
        verifyToken(_token) {
          return Promise.resolve({
            appId: "app-id",
            token: expectedToken as unknown as DecodedAppCheckToken,
            alreadyConsumed: false
          });
        }
      });
      const appCheckAdapter = new FirebaseAppCheckAdapter(client);

      const query: AppCheckVerifyTokenQuery = { token: expectedToken };

      // act & assert
      await expect(appCheckAdapter.verifyToken(query)).resolves.toBeUndefined();
    });

    it("should succeed when NODE_ENV is development", async () => {
      // arrange
      const originalEnv = process.env;

      process.env.NODE_ENV = "development";
      const expectedToken = "app-check-token";

      const client = makeMockObject<AppCheck>({
        verifyToken(token) {
          expect(token).toBe(expectedToken);

          return Promise.reject(new Error("on error when verifying token"));
        }
      });
      const appCheckAdapter = new FirebaseAppCheckAdapter(client);

      const query: AppCheckVerifyTokenQuery = { token: expectedToken };

      // act & assert
      await expect(appCheckAdapter.verifyToken(query)).resolves.toBeUndefined();

      // teardown
      process.env = { ...originalEnv };
    });
  });
});
