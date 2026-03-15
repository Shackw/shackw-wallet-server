import { describe, it, expect } from "vitest";

import { StubAppCheckAdapter } from "@test/doubles/adapters/stub-app-check.adpter";

import { ApplicationError } from "@/application/errors";
import type { AppCheckVerifyTokenQuery } from "@/application/ports/adapters/app-check.adapter.port";

import { DefaultAppCheckPolicy } from "./app-check.policy";

import type { VerifyAppCheckTokenInput } from "./app-check.policy.type";

describe("AppCheckPolicy", () => {
  describe("verifyAppCheckToken", () => {
    it("should throw UNAUTHORIZED when an invalid App Check token is received", async () => {
      // arrange
      class TestAppCheckAdapter extends StubAppCheckAdapter {
        verifyToken(_query: AppCheckVerifyTokenQuery): Promise<void> {
          throw new Error("invalid app check token");
        }
      }

      const appCheckAdap = new TestAppCheckAdapter();
      const appCheckPolicy = new DefaultAppCheckPolicy(appCheckAdap);

      const input: VerifyAppCheckTokenInput = {
        token: "app-check-token"
      };

      // act & assert
      await expect(appCheckPolicy.verify(input)).rejects.toThrow(
        new ApplicationError({
          code: "UNAUTHORIZED",
          message: "Invalid App Check token",
          httpStatus: 401,
          cause: new Error("invalid app check token")
        })
      );
    });

    it("should succeed when an valid App Check Token is received", async () => {
      // arrange
      class TestAppCheckAdaper extends StubAppCheckAdapter {
        verifyToken(_query: AppCheckVerifyTokenQuery): Promise<void> {
          return Promise.resolve();
        }
      }

      const appCheckAdapter = new TestAppCheckAdaper();
      const appCheckPolicy = new DefaultAppCheckPolicy(appCheckAdapter);

      const input: VerifyAppCheckTokenInput = {
        token: "app-check-token"
      };

      // act & assert
      await expect(appCheckPolicy.verify(input)).resolves.toBeUndefined();
    });
  });
});
