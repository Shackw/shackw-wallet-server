import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { StubRegistryAdapter } from "@test/doubles/adapters/stub-registry.adapter";
import { StubBalanceSufficiencyPolicy } from "@test/doubles/policies/stub-balance-sufficiency.policy";

import { ApplicationError } from "@/application/errors";
import type { TransferEligibilityInput, TransferEligibilityOutput } from "@/application/policies/transfer-eligibility";
import { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import type { GetNextNonceQuery } from "@/application/ports/adapters/registry.adapter.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { QuotesService } from "./quotes.service";

import type { CreateQuoteInput } from "./quotes.service.types";
import type { Hex } from "viem";

describe("QuotesService", () => {
  describe("createQuote", () => {
    const secret: Hex = "0x4ea68bd31814a40a7c96d27e675b4c48dec2c34451efbd6dfd5ab1c63942b7c2";

    const transferEligibilityOutput: TransferEligibilityOutput = {
      chain: {
        key: "mainnet",
        id: CHAIN_KEY_TO_VIEM_CHAIN.mainnet.id,
        rpcUrl: "https://test-rpc.com",
        viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
      },
      tokenDep: {
        token: {
          symbol: "JPYC",
          address: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
          currency: "JPY",
          decimals: 18
        },
        fixedFeeAmountUnits: 100000000000000000000n
      },
      feeTokenDep: {
        token: {
          symbol: "USDC",
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          currency: "USD",
          decimals: 6
        },
        fixedFeeAmountUnits: 1000000n
      },
      contracts: {
        sponsor: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        delegate: "0xeD269D025dCed3a7d192923BFaaf605ef830e338",
        registry: "0xb631172683DA82B2C87D8f84E2C51698D0719e8C"
      },
      feePolicy: {
        method: "fixed_by_chain",
        version: "v1",
        chainKey: "mainnet"
      }
    };

    const baseInput: CreateQuoteInput = {
      chainKey: "mainnet",
      sender: "0x1A4B5F3C2E9D7B8a6C4fD1E2A3b5C6D7E8F9A0B1",
      recipient: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      tokenSymbol: "JPYC",
      feeTokenSymbol: "USDC",
      amountMinUnits: 1000000000000000000000n
    };

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should throw FAILED_TO_FETCH_NEXT_NONCE when fetching the next nonce fails", async () => {
      // arrange
      class TestRegistryAdapter extends StubRegistryAdapter {
        getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
          expect(query).toEqual({ chainKey: baseInput.chainKey, owner: baseInput.sender });

          return Promise.reject(new Error("on error when fetching next nonce"));
        }
      }

      class TestTransferEligibilityPolicy extends TransferEligibilityPolicy {
        execute(input: TransferEligibilityInput): TransferEligibilityOutput {
          expect(input).toEqual({
            chainKey: baseInput.chainKey,
            tokenSymbol: baseInput.tokenSymbol,
            feeTokenSymbol: baseInput.feeTokenSymbol,
            amountMinUnits: baseInput.amountMinUnits
          });

          return transferEligibilityOutput;
        }
      }

      const registryAdapter = new TestRegistryAdapter();
      const transferEligibility = new TestTransferEligibilityPolicy();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const quotes = new QuotesService(secret, registryAdapter, transferEligibility, balanceSufficiency);

      // act & assert
      await expect(quotes.createQuote(baseInput)).rejects.toThrow(
        new ApplicationError({
          code: "FAILED_TO_FETCH_NEXT_NONCE",
          message: "Failed to fetch next nonce.",
          cause: new Error("on error when fetching next nonce")
        })
      );
    });

    it("should return quote model when succeed fetching next nonce", async () => {
      // arrange
      class TestRegistryAdapter extends StubRegistryAdapter {
        getNextNonce(_query: GetNextNonceQuery): Promise<bigint> {
          return Promise.resolve(1000n);
        }
      }

      class TestTransferEligibilityPolicy extends TransferEligibilityPolicy {
        execute(_input: TransferEligibilityInput): TransferEligibilityOutput {
          return transferEligibilityOutput;
        }
      }

      const registryAdapter = new TestRegistryAdapter();
      const transferEligibility = new TestTransferEligibilityPolicy();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const quotes = new QuotesService(secret, registryAdapter, transferEligibility, balanceSufficiency);

      // act
      const quote = await quotes.createQuote(baseInput);

      // assert
      expect(quote).toEqual({
        nonce: 1000n,
        quoteToken:
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAABpLXzwunXuKbE_R4qO1xtfo-aCxAAAAAAAAAAAAAAAAXGm-5wHvgUoraj7dSxZSy5zFqm8AAAAAAAAAAAAAAADnw9jJpDn-3gDSYAAy1dsL5xw8KQAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2Ncmtxd6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9CQAAAAAAAAAAAAAAAAO0mnQJdztOn0ZKSO_qvYF74MOM4AAAAAAAAAAAAAAAAjzz3rSPNPK29lzWv-VgCMjnGoGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaVW5eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPo5Gt05Bn1VJsUan48cdi44yoD6JtmdV3H9MXsqhilDv8.8HPa0iiYIJvrcTrFz_bfS6WFLX2yop3Fp1S-9pQjdOQ",
        expiresAt: new Date("2026-01-01T00:02:00.000Z"),
        serverTime: new Date("2026-01-01T00:00:00.000Z"),
        chainId: 1,
        delegate: "0xeD269D025dCed3a7d192923BFaaf605ef830e338",
        sponsor: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        sender: "0x1A4B5F3C2E9D7B8a6C4fD1E2A3b5C6D7E8F9A0B1",
        recipient: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        token: {
          symbol: "JPYC",
          address: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
          decimals: 18
        },
        feeToken: {
          symbol: "USDC",
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          decimals: 6
        },
        amount: { symbol: "JPYC", minUnits: 1000000000000000000000n, decimals: 18 },
        fee: { symbol: "USDC", minUnits: 1000000n, decimals: 6 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" },
        callHash: "0xe46b74e419f5549b146a7e3c71d8b8e32a03e89b66755dc7f4c5ecaa18a50eff"
      });
    });
  });
});
