import { describe, it, expect } from "vitest";

import { ApplicationError } from "@/application/errors";
import type { QuoteTokenValueObject } from "@/domain/value-objects/quote-token.value-object";

import { decodeQuoteToken, encodeQuoteToken } from "./quote-token.protocol";

import type { Address, Hex } from "viem";

describe("QuoteTokenProtocol", () => {
  describe("encodeQuoteToken", () => {
    const baseInput: QuoteTokenValueObject = {
      v: 0,
      chainId: 1,
      sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      feeToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amountMinUnits: 1_000_000n,
      feeMinUnits: 10_000n,
      delegate: "0x1111111111111111111111111111111111111111",
      sponsor: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      expiresAt: 1_800_000_000n,
      nonce: 1n,
      callHash: "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76"
    };

    const secret: Hex = "0x4ea68bd31814a40a7c96d27e675b4c48dec2c34451efbd6dfd5ab1c63942b7c2";

    const assertToken =
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.uuxljJec5RnE3BW-LAXMiGnxayQEj4zu8pgiLgW2Yxg";

    it("should succeed with checksum addresses", () => {
      // act
      const result = encodeQuoteToken(baseInput, secret);

      // assert
      expect(result).toEqual(assertToken);
    });

    it("should succeed with lowercase addresses", () => {
      // arrange
      const input: QuoteTokenValueObject = {
        ...baseInput,
        sender: baseInput.sender.toLowerCase() as Address,
        recipient: baseInput.recipient.toLowerCase() as Address,
        token: baseInput.token.toLowerCase() as Address,
        feeToken: baseInput.feeToken.toLowerCase() as Address,
        delegate: baseInput.delegate.toLowerCase() as Address,
        sponsor: baseInput.sponsor.toLowerCase() as Address
      };

      // act
      const result = encodeQuoteToken(input, secret);

      // assert
      expect(result).toEqual(assertToken);
    });
  });

  describe("decodeQuoteToken", () => {
    const secret: Hex = "0x4ea68bd31814a40a7c96d27e675b4c48dec2c34451efbd6dfd5ab1c63942b7c2";

    it("should throw QUOTE_TOKEN_MALFORMED when quote token does not include a comma", () => {
      // arrange
      const quoteToken = "AAAAAAA";

      // act & assert
      expect(() => decodeQuoteToken(quoteToken, secret)).toThrow(
        new ApplicationError({ code: "QUOTE_TOKEN_MALFORMED", message: "Malformed quoteToken." })
      );
    });

    it("should throw QUOTE_TOKEN_MAC_INVALID when quote token MAC is invalid", () => {
      // arrange
      const quoteToken =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.qhdLgvpEuKrANR8uXtQcenuEdQI6x89s06rWLaa_jR0";

      // act & assert
      expect(() => decodeQuoteToken(quoteToken, secret)).toThrow(
        new ApplicationError({ code: "QUOTE_TOKEN_MAC_INVALID", message: "Invalid quoteToken MAC." })
      );
    });

    it("should throw QUOTE_TOKEN_UNSUPPORTED_VERSION when decoded token version is unsupported", () => {
      // arrange
      const quoteToken =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.uuxljJec5RnE3BW-LAXMiGnxayQEj4zu8pgiLgW2Yxg";

      // act & assert
      expect(() => decodeQuoteToken(quoteToken, secret)).toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_UNSUPPORTED_VERSION",
          message: "Unsupported quoteToken version: v=0."
        })
      );
    });

    it("should succeed when quote token is valid", () => {
      // arrange
      const quoteToken =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.m-F3v7CYvkMAdMewnT13OABknpg1Bm62toqB0z2LxiY";

      // act
      const result = decodeQuoteToken(quoteToken, secret);

      // assert
      expect(result).toEqual({
        v: 1,
        chainId: 1,
        sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        feeToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        amountMinUnits: 1000000n,
        feeMinUnits: 10000n,
        delegate: "0x1111111111111111111111111111111111111111",
        sponsor: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        expiresAt: 1800000000n,
        nonce: 1n,
        callHash: "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76"
      });
    });
  });

  it("should preserve the payload after encode and decode", () => {
    // arrange
    const input: QuoteTokenValueObject = {
      v: 1,
      chainId: 1,
      sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      feeToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amountMinUnits: 1_000_000n,
      feeMinUnits: 10_000n,
      delegate: "0x1111111111111111111111111111111111111111",
      sponsor: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      expiresAt: 1_800_000_000n,
      nonce: 1n,
      callHash: "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76"
    };

    const secret: Hex = "0x4ea68bd31814a40a7c96d27e675b4c48dec2c34451efbd6dfd5ab1c63942b7c2";

    // act
    const encoded = encodeQuoteToken(input, secret);
    const decoded = decodeQuoteToken(encoded, secret);

    // assert
    expect(decoded).toEqual(input);
  });
});
