import { describe, it, expect } from "vitest";

import { StubAppCheckAdapter } from "@test/doubles/adapters/stub-app-check.adpter";

import { ApplicationError } from "@/application/errors";
import type { AppCheckVerifyTokenQuery } from "@/application/ports/adapters/app-check.adapter.port";

import { AppCheckPolicy } from "./app-check.policy";

import type { VerifyAppCheckTokenInput } from "./app-check.policy.type";

describe("AppCheckPolicy", () => {
  describe("verifyAppCheckToken", () => {
    it("should throw UNAUTHORIZED when an invalid App Check token is received", async () => {
      // arrange
      class TestAppCheckAdap extends StubAppCheckAdapter {
        verifyToken(_query: AppCheckVerifyTokenQuery): Promise<void> {
          throw new Error("error");
        }
      }

      const testAppCheckAdap = new TestAppCheckAdap();
      const appCheckPol = new AppCheckPolicy(testAppCheckAdap);

      const input: VerifyAppCheckTokenInput = {
        token: "app-check-token"
      };

      // act & assert
      await expect(appCheckPol.verify(input)).rejects.toThrow(
        new ApplicationError({
          code: "UNAUTHORIZED",
          message: "Invalid App Check token",
          httpStatus: 401,
          cause: new Error("error")
        })
      );
    });

    it("should succeed when an valid App Check Token is received", async () => {
      // arrange
      class TestAppCheckAdap extends StubAppCheckAdapter {
        verifyToken(_query: AppCheckVerifyTokenQuery): Promise<void> {
          return Promise.resolve();
        }
      }

      const testAppCheckAdap = new TestAppCheckAdap();
      const appCheckPol = new AppCheckPolicy(testAppCheckAdap);

      const input: VerifyAppCheckTokenInput = {
        token: "app-check-token"
      };

      // act & assert
      await expect(appCheckPol.verify(input)).resolves.toBeUndefined();
    });
  });
});
