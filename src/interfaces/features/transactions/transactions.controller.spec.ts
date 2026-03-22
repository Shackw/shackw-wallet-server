import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { makeMockObject } from "@test/utils";

import type { SearchTransactionsInput, TransactionsService } from "@/application/services/transactions";
import type { TransactionEntity } from "@/domain/entities/transaction.entity";

import { TransactionsController } from "./transactions.controller";

import type { SearchTransactionsRequestDto } from "./transactions.dto";

describe("TransactionsController", () => {
  describe("searchTransactions", () => {
    it("should return search transactions response for given request", async () => {
      // arrange
      const rawAddress = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";
      const txHash = "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76";

      const mockEntity: TransactionEntity = {
        txHash,
        blockNumber: 1000n,
        logIndex: 0,
        token: { symbol: "JPYC", address: rawAddress, decimals: 18 },
        direction: "in",
        value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
        counterparty: { address: rawAddress },
        transferredAt: new Date("2025-01-01T00:00:00.000Z"),

        /** not exsists field */
        unknownField: "extra"
      } as TransactionEntity;

      const transactions = makeMockObject<TransactionsService>({
        searchTransactions(input: SearchTransactionsInput): Promise<TransactionEntity[]> {
          expect(input).toEqual({
            chainKey: "mainnet",
            tokenSymbols: ["JPYC"],
            walletAddress: getAddress(rawAddress),
            timestampGte: 1_000_000_000,
            timestampLte: 1_000_000_001,
            searchDirection: "in",
            limit: undefined
          });

          return Promise.resolve([mockEntity]);
        }
      });

      const transactionsController = new TransactionsController(transactions);

      const dto: SearchTransactionsRequestDto = {
        chain: "mainnet",
        tokens: [{ symbol: "JPYC" }],
        wallet: getAddress(rawAddress),
        timestampGte: 1_000_000_000,
        timestampLte: 1_000_000_001,
        direction: "in",
        limit: undefined
      };

      // act
      const res = await transactionsController.searchTransactions(dto);

      // assert
      expect(res).toEqual([
        {
          txHash,
          blockNumber: 1000n,
          logIndex: 0,
          token: { symbol: "JPYC", address: getAddress(rawAddress), decimals: 18 },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: getAddress(rawAddress) },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });
  });
});
