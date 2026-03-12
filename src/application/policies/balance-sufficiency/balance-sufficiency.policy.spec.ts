import { describe, it, expect } from "vitest";

import { StubViemErc20Adap } from "@test/doubles/adapters/stub-viem-erc20.adapter";
import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import { ApplicationError } from "@/application/errors";
import type { GetBalanceQuery } from "@/application/ports/adapters/erc20.adapter.port";
import type {
  FindTokenMasterByAddressQuery,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";

import { BalanceSufficiencyPolicy } from "./balance-sufficiency.policy";

import type { EnsureSufficientBalanceInput } from "./balance-sufficiency.policy.types";

describe("BalanceSufficiencyPolicy", () => {
  describe("ensure", () => {
    it("should throw TOKEN_ADDRESS_UNKNOWN when token address is not registered", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          expect(query).toEqual({ chainKey: "mainnet", address: "0xNullAddress" });

          return null;
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const stubViemErc20Adap = new StubViemErc20Adap();
      const balanceSufficiency = new BalanceSufficiencyPolicy(testTokenDepRepo, stubViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xNullAddress",
        tokenRequiredMinUnits: 0n,
        feeTokenAddress: "0xNullAddress",
        feeRequiredMinUnits: 0n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toMatchObject({
        code: "TOKEN_ADDRESS_UNKNOWN",
        message: "Unknown token address: 0xNullAddress"
      });
    });

    it("should throw TOKEN_ADDRESS_UNKNOWN when fee token address is not registered", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          if (query.address === "0xJpycAddress")
            return {
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            };
          return null;
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const stubViemErc20Adap = new StubViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, stubViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 0n,
        feeTokenAddress: "0xNullAddress",
        feeRequiredMinUnits: 0n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).rejects.toThrowError(
        new ApplicationError({ code: "TOKEN_ADDRESS_UNKNOWN", message: "Unknown feeToken address: 0xNullAddress" })
      );
    });

    it("should throw INSUFFICIENT_COMBINED_BALANCE when token and fee token are the same and balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          return {
            symbol: "JPYC",
            currency: "JPY",
            decimals: 0
          };
        }
      }

      class TestViemErc20Adap extends StubViemErc20Adap {
        getBalance(query: GetBalanceQuery): Promise<bigint> {
          expect(query).toEqual({ chainKey: "mainnet", owner: "0xOwner", tokenAddress: "0xJpycAddress" });

          return Promise.resolve(50n);
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const testViemErc20Adap = new TestViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, testViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xJpycAddress",
        feeRequiredMinUnits: 100n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).rejects.toThrowError(
        new ApplicationError({
          code: "INSUFFICIENT_COMBINED_BALANCE",
          message: "Insufficient JPYC balance: required 200 minimal units (amount 100 + fee 100), but sender has 50."
        })
      );
    });

    it("should throw INSUFFICIENT_SEND_BALANCE when send token balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          if (query.address === "0xJpycAddress")
            return {
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            };
          else if (query.address === "0xUsdcAddress")
            return {
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            };
          return null;
        }
      }

      class TestViemErc20Adap extends StubViemErc20Adap {
        getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(30n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(30n);
          throw new Error();
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const testViemErc20Adap = new TestViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, testViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 100n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).rejects.toThrowError(
        new ApplicationError({
          code: "INSUFFICIENT_SEND_BALANCE",
          message: "Insufficient JPYC balance: required 100 minimal units, but sender has 30."
        })
      );
    });

    it("should throw INSUFFICIENT_FEE_BALANCE when fee token balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          if (query.address === "0xJpycAddress")
            return {
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            };
          else if (query.address === "0xUsdcAddress")
            return {
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            };
          return null;
        }
      }

      class TestViemErc20Adap extends StubViemErc20Adap {
        getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(200n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(45n);
          throw new Error();
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const testViemErc20Adap = new TestViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, testViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).rejects.toThrowError(
        new ApplicationError({
          code: "INSUFFICIENT_FEE_BALANCE",
          message: "Insufficient USDC balance for fee: required 500 minimal units, but sender has 45."
        })
      );
    });

    it("should succeed when send token and fee token are the same and combined balance is sufficient", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          return {
            symbol: "JPYC",
            currency: "JPY",
            decimals: 0
          };
        }
      }

      class TestViemErc20Adap extends StubViemErc20Adap {
        getBalance(_query: GetBalanceQuery): Promise<bigint> {
          return Promise.resolve(1000n);
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const testViemErc20Adap = new TestViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, testViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 500n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).resolves.toBeUndefined();
    });

    it("should succeed when both token balance and fee balance are sufficient", async () => {
      // arrange
      class TestTokenDepRepo extends StubTokenDeploymentRepository {
        findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
          if (query.address === "0xJpycAddress")
            return {
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            };
          else if (query.address === "0xUsdcAddress")
            return {
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            };
          return null;
        }
      }

      class TestViemErc20Adap extends StubViemErc20Adap {
        getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(1000n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(1000n);
          throw new Error();
        }
      }

      const testTokenDepRepo = new TestTokenDepRepo();
      const testViemErc20Adap = new TestViemErc20Adap();
      const balSuffPol = new BalanceSufficiencyPolicy(testTokenDepRepo, testViemErc20Adap);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 500n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balSuffPol.ensure(input)).resolves.toBeUndefined();
    });
  });
});
