import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { makeMockObject } from "@test/utils";

import type { CreateQuoteInput, QuotesService } from "@/application/services/quotes";
import type { QuoteEntity } from "@/domain/entities/quote.entity";

import { QuotesController } from "./quotes.controller";

import type { CreateQuoteRequestDto } from "./quotes.dto";

describe("QuotesController", () => {
  describe("create", () => {
    it("should return created quote response for given request", async () => {
      // arrange
      const rawAddress = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      const quoteToken =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.uuxljJec5RnE3BW-LAXMiGnxayQEj4zu8pgiLgW2Yxg";
      const callHash = "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76";

      const mockEntity: QuoteEntity = {
        nonce: 1n,
        quoteToken,
        expiresAt: new Date("2025-01-01T00:00:00.000Z"),
        serverTime: new Date("2025-01-01T00:00:00.000Z"),
        chainId: 1,
        delegate: rawAddress,
        sponsor: rawAddress,
        sender: rawAddress,
        recipient: rawAddress,
        token: { symbol: "JPYC", address: rawAddress, decimals: 18 },
        feeToken: { symbol: "JPYC", address: rawAddress, decimals: 18 },
        amount: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
        fee: { symbol: "JPYC", minUnits: 100n, decimals: 18 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" },
        callHash,

        /** not exsists field */
        unknownField: "extra"
      } as QuoteEntity;

      const quotes = makeMockObject<QuotesService>({
        createQuote(input: CreateQuoteInput): Promise<QuoteEntity> {
          expect(input).toEqual({
            chainKey: "mainnet",
            sender: getAddress(rawAddress),
            recipient: getAddress(rawAddress),
            tokenSymbol: "JPYC",
            feeTokenSymbol: "JPYC",
            amountMinUnits: 0n
          });

          return Promise.resolve(mockEntity);
        }
      });

      const quotesController = new QuotesController(quotes);

      const dto: CreateQuoteRequestDto = {
        chain: "mainnet",
        sender: getAddress(rawAddress),
        recipient: getAddress(rawAddress),
        token: { symbol: "JPYC" },
        feeToken: { symbol: "JPYC" },
        amountMinUnits: 0n
      };

      // act
      const res = await quotesController.create(dto);

      // assert
      expect(res).toEqual({
        nonce: 1n,
        quoteToken,
        expiresAt: new Date("2025-01-01T00:00:00.000Z"),
        serverTime: new Date("2025-01-01T00:00:00.000Z"),
        chainId: 1,
        delegate: getAddress(rawAddress),
        sponsor: getAddress(rawAddress),
        sender: getAddress(rawAddress),
        recipient: getAddress(rawAddress),
        token: { symbol: "JPYC", address: getAddress(rawAddress), decimals: 18 },
        feeToken: { symbol: "JPYC", address: getAddress(rawAddress), decimals: 18 },
        amount: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
        fee: { symbol: "JPYC", minUnits: 100n, decimals: 18 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" },
        callHash
      });
    });
  });
});
