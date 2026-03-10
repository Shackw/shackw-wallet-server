import { describe, it, expect } from "vitest";

import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import { ApplicationError } from "@/application/errors";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/config/chain.config";

import { ChainToTokenSupportPolicy } from "../chain-to-token-support";

import { TransferEligibilityPolicy } from "./transfer-eligibility.policy";

import type { TransferEligibilityInput } from "./transfer-eligibility.policy.types";
import type { ChainToTokenSupportInput, ChainToTokenSupportOutput } from "../chain-to-token-support";

describe("TransferEligibilityPolicy.execute", () => {
  it("should throw TRANSFER_AMOUNT_BELOW_MINIMUM when the transfer amount is below the minimum", () => {
    // arrange
    class TestChainToTokenSupport extends ChainToTokenSupportPolicy {
      execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
        const common = {
          chain: {
            id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
            key: input.chainKey,
            rpcUrl: `https://test-rpc.com/${input.chainKey}`,
            viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
          },
          contracts: {
            delegate: "0xDelegate",
            registry: "0xRegistry"
          }
        } as const;

        if (input.tokenSymbol === "JPYC") {
          expect(input).toEqual({ chainKey: "mainnet", tokenSymbol: "JPYC" });
          return {
            ...common,
            token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        } else if (input.tokenSymbol === "USDC") {
          expect(input).toEqual({ chainKey: "mainnet", tokenSymbol: "USDC" });
          return {
            ...common,
            token: { address: "0xUsdcAddress", symbol: "USDC", currency: "USD", decimals: 6 },
            minTransferAmountUnits: 10000000n,
            fixedFeeAmountUnits: 1000000n
          };
        }
        throw new Error();
      }
    }

    const stubTokenDepRepo = new StubTokenDeploymentRepository();
    const testChainToTokenSupport = new TestChainToTokenSupport(stubTokenDepRepo);
    const transferEligibility = new TransferEligibilityPolicy(testChainToTokenSupport);

    const input: TransferEligibilityInput = {
      chainKey: "mainnet",
      tokenSymbol: "JPYC",
      feeTokenSymbol: "USDC",
      amountMinUnits: 500n
    };

    // act & assert
    expect(() => transferEligibility.execute(input)).toThrowError(
      new ApplicationError({
        code: "TRANSFER_AMOUNT_BELOW_MINIMUM",
        message: "Minimum transferable amount for JPYC is 1000 JPYC (1000000000000000000000 minimal units)."
      })
    );
  });

  it("should succeed when the transfer amount is above the minimum", () => {
    // arrange
    class TestChainToTokenSupport extends ChainToTokenSupportPolicy {
      execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
        const common = {
          chain: {
            id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
            key: input.chainKey,
            rpcUrl: `https://test-rpc.com/${input.chainKey}`,
            viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
          },
          contracts: {
            delegate: "0xDelegate",
            registry: "0xRegistry"
          }
        } as const;

        if (input.tokenSymbol === "JPYC")
          return {
            ...common,
            token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        else if (input.tokenSymbol === "USDC")
          return {
            ...common,
            token: { address: "0xUsdcAddress", symbol: "USDC", currency: "USD", decimals: 6 },
            minTransferAmountUnits: 10000000n,
            fixedFeeAmountUnits: 1000000n
          };

        throw new Error();
      }
    }

    const stubTokenDepRepo = new StubTokenDeploymentRepository();
    const testChainToTokenSupport = new TestChainToTokenSupport(stubTokenDepRepo);
    const transferEligibility = new TransferEligibilityPolicy(testChainToTokenSupport);

    const input: TransferEligibilityInput = {
      chainKey: "mainnet",
      tokenSymbol: "JPYC",
      feeTokenSymbol: "USDC",
      amountMinUnits: 100000000000000000000000n
    };

    // act
    const tokenDep = transferEligibility.execute(input);

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
      contracts: { delegate: "0xDelegate", registry: "0xRegistry" },
      feePolicy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" }
    });
  });
});
