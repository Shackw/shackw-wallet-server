import { describe, it, expect } from "vitest";

import { ApplicationError } from "@/application/errors";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { ChainToTokenSupportPolicy } from "../chain-to-token-support";

import { DefaultTransferEligibilityPolicy } from "./transfer-eligibility.policy";

import type { TransferEligibilityInput } from "./transfer-eligibility.policy.types";
import type { ChainToTokenSupportInput, ChainToTokenSupportOutput } from "../chain-to-token-support";

describe("TransferEligibilityPolicy", () => {
  describe("execute", () => {
    it("should throw TRANSFER_AMOUNT_BELOW_MINIMUM when the transfer amount is below the minimum", async () => {
      // arrange
      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): Promise<ChainToTokenSupportOutput> {
          const common = {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            }
          } as const;

          if (input.tokenSymbol === "JPYC") {
            expect(input).toEqual({ chainKey: "mainnet", tokenSymbol: "JPYC" });
            return Promise.resolve({
              ...common,
              token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 18 },
              minTransferAmountUnits: 1000000000000000000000n,
              fixedFeeAmountUnits: 100000000000000000000n
            });
          } else if (input.tokenSymbol === "USDC") {
            expect(input).toEqual({ chainKey: "mainnet", tokenSymbol: "USDC" });
            return Promise.resolve({
              ...common,
              token: { address: "0xUsdcAddress", symbol: "USDC", currency: "USD", decimals: 6 },
              minTransferAmountUnits: 10000000n,
              fixedFeeAmountUnits: 1000000n
            });
          }
          return Promise.reject(new Error());
        }
      }

      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transferEligibility = new DefaultTransferEligibilityPolicy(chainToTokenSupport);

      const input: TransferEligibilityInput = {
        chainKey: "mainnet",
        tokenSymbol: "JPYC",
        feeTokenSymbol: "USDC",
        amountMinUnits: 500n
      };

      // act & assert
      await expect(transferEligibility.execute(input)).rejects.toThrow(
        new ApplicationError({
          code: "TRANSFER_AMOUNT_BELOW_MINIMUM",
          message: "Minimum transferable amount for JPYC is 1000 JPYC (1000000000000000000000 minimal units)."
        })
      );
    });

    it("should return transfer eligibility when transfer amount is above the minimum", async () => {
      // arrange
      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): Promise<ChainToTokenSupportOutput> {
          const common = {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            }
          } as const;

          if (input.tokenSymbol === "JPYC")
            return Promise.resolve({
              ...common,
              token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 18 },
              minTransferAmountUnits: 1000000000000000000000n,
              fixedFeeAmountUnits: 100000000000000000000n
            });
          else if (input.tokenSymbol === "USDC")
            return Promise.resolve({
              ...common,
              token: { address: "0xUsdcAddress", symbol: "USDC", currency: "USD", decimals: 6 },
              minTransferAmountUnits: 10000000n,
              fixedFeeAmountUnits: 1000000n
            });
          return Promise.reject(new Error());
        }
      }

      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transferEligibility = new DefaultTransferEligibilityPolicy(chainToTokenSupport);

      const input: TransferEligibilityInput = {
        chainKey: "mainnet",
        tokenSymbol: "JPYC",
        feeTokenSymbol: "USDC",
        amountMinUnits: 100000000000000000000000n
      };

      // act
      const tokenDep = await transferEligibility.execute(input);

      // assert
      expect(tokenDep).toMatchObject({
        chain: {
          id: 1,
          key: "mainnet",
          rpcUrl: "https://test-rpc.com/mainnet"
        },
        tokenDep: {
          token: {
            address: "0xJpycAddress",
            symbol: "JPYC",
            currency: "JPY",
            decimals: 18
          },
          fixedFeeAmountUnits: 100000000000000000000n
        },
        feeTokenDep: {
          token: {
            address: "0xUsdcAddress",
            symbol: "USDC",
            currency: "USD",
            decimals: 6
          },
          fixedFeeAmountUnits: 1000000n
        },
        contracts: { sponsor: "0xSponsor", delegate: "0xDelegate", registry: "0xRegistry" },
        feePolicy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" }
      });
    });
  });
});
