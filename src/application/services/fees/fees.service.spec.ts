import { describe, it, expect } from "vitest";

import type { TransferEligibilityInput, TransferEligibilityOutput } from "@/application/policies/transfer-eligibility";
import { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { FeesService } from "./fees.service";

import type { EstimateFeeInput } from "./fees.service.types";

describe("FeesService", () => {
  describe("estimateFee", () => {
    it("should return fee estimation when transfer eligibility is valid", async () => {
      // arrange
      class TestTransferEligibilityPolicy extends TransferEligibilityPolicy {
        execute(input: TransferEligibilityInput): Promise<TransferEligibilityOutput> {
          return Promise.resolve({
            chain: {
              key: input.chainKey,
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              rpcUrl: "https://test-rpc.com",
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            tokenDep: {
              token: { symbol: "JPYC", address: "0xTokenAddress", currency: "JPY", decimals: 18 },
              fixedFeeAmountUnits: 100000000000000000000n
            },
            feeTokenDep: {
              token: { symbol: "USDC", address: "0xFeeTokenAddress", currency: "USD", decimals: 6 },
              fixedFeeAmountUnits: 1000000n
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            },
            feePolicy: {
              method: "fixed_by_chain",
              version: "v1",
              chainKey: "mainnet"
            }
          });
        }
      }

      const transferEligibility = new TestTransferEligibilityPolicy();
      const fees = new FeesService(transferEligibility);

      const input: EstimateFeeInput = {
        chainKey: "mainnet",
        tokenSymbol: "JPYC",
        feeTokenSymbol: "USDC",
        amountMinUnits: 5000000000000000000000n
      };

      // act
      const fee = await fees.estimateFee(input);

      // assert
      expect(fee).toEqual({
        token: { symbol: "JPYC", address: "0xTokenAddress", decimals: 18 },
        feeToken: { symbol: "USDC", address: "0xFeeTokenAddress", decimals: 6 },
        amount: { symbol: "JPYC", minUnits: 5000000000000000000000n, decimals: 18 },
        fee: { symbol: "USDC", minUnits: 1000000n, decimals: 6 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" }
      });
    });
  });
});
