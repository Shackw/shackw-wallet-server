import { describe, it, expect } from "vitest";

import { StubErc20Adap } from "@test/doubles/adapters/stub-erc20.adapter";
import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import { ApplicationError } from "@/application/errors";
import type { GetBalanceQuery } from "@/application/ports/adapters/erc20.adapter.port";
import type {
  FindTokenMasterByAddressQuery,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";

import { DefaultBalanceSufficiencyPolicy } from "./balance-sufficiency.policy";

import type { EnsureSufficientBalanceInput } from "./balance-sufficiency.policy.types";

describe("BalanceSufficiencyPolicy", () => {
  describe("ensure", () => {
    it("should throw TOKEN_ADDRESS_UNKNOWN when token address is not registered", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          expect(query).toEqual({ chainKey: "mainnet", address: "0xNullAddress" });

          return Promise.resolve(null);
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new StubErc20Adap();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

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
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          if (query.address === "0xJpycAddress")
            return Promise.resolve({
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            });
          return Promise.resolve(null);
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new StubErc20Adap();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 0n,
        feeTokenAddress: "0xNullAddress",
        feeRequiredMinUnits: 0n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({ code: "TOKEN_ADDRESS_UNKNOWN", message: "Unknown feeToken address: 0xNullAddress" })
      );
    });

    it("should throw FAILED_TO_FETCH_TOKEN_BALANCE when fetching the send token balance fails", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          return Promise.resolve({
            symbol: "JPYC",
            currency: "JPY",
            decimals: 0
          });
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(query: GetBalanceQuery): Promise<bigint> {
          expect(query).toEqual({ chainKey: "mainnet", owner: "0xOwner", tokenAddress: "0xJpycAddress" });

          return Promise.reject(new Error("on error when fetching send token balance"));
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 0n,
        feeTokenAddress: "0xNullAddress",
        feeRequiredMinUnits: 0n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({
          code: "FAILED_TO_FETCH_TOKEN_BALANCE",
          message: "Failed to fetch send token balance.",
          cause: new Error("on error when fetching send token balance")
        })
      );
    });

    it("should throw INSUFFICIENT_COMBINED_BALANCE when token and fee token are the same and balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          return Promise.resolve({
            symbol: "JPYC",
            currency: "JPY",
            decimals: 0
          });
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(_query: GetBalanceQuery): Promise<bigint> {
          return Promise.resolve(50n);
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xJpycAddress",
        feeRequiredMinUnits: 100n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({
          code: "INSUFFICIENT_COMBINED_BALANCE",
          message: "Insufficient JPYC balance: required 200 minimal units (amount 100 + fee 100), but sender has 50."
        })
      );
    });

    it("should throw FAILED_TO_FETCH_TOKEN_BALANCE when fetching the fee token balance fails", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          if (query.address === "0xJpycAddress")
            return Promise.resolve({
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            });
          else if (query.address === "0xUsdcAddress")
            return Promise.resolve({
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            });
          return Promise.resolve(null);
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(30n);
          else if (query.tokenAddress === "0xUsdcAddress")
            return Promise.reject(new Error("on error when fetching fee token balance"));
          return Promise.reject(new Error());
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 100n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({
          code: "FAILED_TO_FETCH_TOKEN_BALANCE",
          message: "Failed to fetch fee token balance.",
          cause: new Error("on error when fetching fee token balance")
        })
      );
    });

    it("should throw INSUFFICIENT_SEND_BALANCE when send token balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          if (query.address === "0xJpycAddress")
            return Promise.resolve({
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            });
          else if (query.address === "0xUsdcAddress")
            return Promise.resolve({
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            });
          return Promise.resolve(null);
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(30n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(30n);
          throw new Error();
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 100n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({
          code: "INSUFFICIENT_SEND_BALANCE",
          message: "Insufficient JPYC balance: required 100 minimal units, but sender has 30."
        })
      );
    });

    it("should throw INSUFFICIENT_FEE_BALANCE when fee token balance is insufficient", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          if (query.address === "0xJpycAddress")
            return Promise.resolve({
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            });
          else if (query.address === "0xUsdcAddress")
            return Promise.resolve({
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            });
          return Promise.resolve(null);
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(200n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(45n);
          throw new Error();
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 100n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).rejects.toThrow(
        new ApplicationError({
          code: "INSUFFICIENT_FEE_BALANCE",
          message: "Insufficient USDC balance for fee: required 500 minimal units, but sender has 45."
        })
      );
    });

    it("should succeed when send token and fee token are the same and combined balance is sufficient", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          return Promise.resolve({
            symbol: "JPYC",
            currency: "JPY",
            decimals: 0
          });
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(_query: GetBalanceQuery): Promise<bigint> {
          return Promise.resolve(1000n);
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 500n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).resolves.toBeUndefined();
    });

    it("should succeed when both token balance and fee balance are sufficient", async () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        override findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
          if (query.address === "0xJpycAddress")
            return Promise.resolve({
              symbol: "JPYC",
              currency: "JPY",
              decimals: 0
            });
          else if (query.address === "0xUsdcAddress")
            return Promise.resolve({
              symbol: "USDC",
              currency: "USD",
              decimals: 0
            });
          return Promise.resolve(null);
        }
      }

      class TestErc20Adapter extends StubErc20Adap {
        override getBalance(query: GetBalanceQuery): Promise<bigint> {
          if (query.tokenAddress === "0xJpycAddress") return Promise.resolve(1000n);
          else if (query.tokenAddress === "0xUsdcAddress") return Promise.resolve(1000n);
          throw new Error();
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const erc20Adapter = new TestErc20Adapter();
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(tokenDepRepository, erc20Adapter);

      const input: EnsureSufficientBalanceInput = {
        chainKey: "mainnet",
        owner: "0xOwner",
        tokenAddress: "0xJpycAddress",
        tokenRequiredMinUnits: 500n,
        feeTokenAddress: "0xUsdcAddress",
        feeRequiredMinUnits: 500n
      };

      // act & assert
      await expect(balanceSufficiency.ensure(input)).resolves.toBeUndefined();
    });
  });
});
