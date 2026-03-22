import { describe, it, expect } from "vitest";

import type { FindTokenMasterByAddressQuery } from "@/application/ports/repositories/token-deployment.repository.port";
import type { TokenDeploymentMaster } from "@/infrastructure/masters/token-deployment.master";

import { StaticTokenDeploymentRepository } from "./static-token-deployment.repository";

describe("StaticTokenDeploymentRepository", () => {
  describe("findTokenMasterByAddress", () => {
    it("should return null if master entry is empty", async () => {
      // arrange
      const inputTokenAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({});
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: inputTokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toBeNull();
    });

    it("should return null if token address mismatches", async () => {
      // arrange
      const inputTokenAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
      const entryTokenAddr = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({
            "JPYC:mainnet": {
              chainKey: "mainnet",
              tokenSymbol: "JPYC",
              tokenAddress: entryTokenAddr,
              fixedFeeAmountUnits: 100n,
              minTransferAmountUnits: 1000n
            }
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: inputTokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toBeNull();
    });

    it("should return token masters if entry found", async () => {
      // arrange
      const tokenAddr = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({
            "JPYC:mainnet": {
              chainKey: "mainnet",
              tokenSymbol: "JPYC",
              tokenAddress: tokenAddr,
              fixedFeeAmountUnits: 100n,
              minTransferAmountUnits: 1000n
            }
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: tokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toEqual({ currency: "JPY", decimals: 18, symbol: "JPYC" });
    });
  });

  //   describe("listChainMasters", () => {
  //     it("", async () => {
  //       expect();
  //     });
  //   });

  //   describe("findChainMaster", () => {
  //     it("", async () => {
  //       expect();
  //     });
  //   });

  //   describe("listTokenDeployment", () => {
  //     it("", async () => {
  //       expect();
  //     });
  //   });

  //   describe("findTokenDeployment", () => {
  //     it("", async () => {
  //       expect();
  //     });
  //   });
});
