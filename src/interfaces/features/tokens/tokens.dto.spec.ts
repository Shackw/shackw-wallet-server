import * as v from "valibot";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { describe, expect, it } from "vitest";

import { TransferTokenRequestDtoSchema } from "./tokens.dto";

describe("TransferTokenRequestDtoSchema", () => {
  const quoteToken =
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.uuxljJec5RnE3BW-LAXMiGnxayQEj4zu8pgiLgW2Yxg";

  const mockAuthorization = {
    chainId: 1,
    address: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    nonce: 100,
    r: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    s: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    v: "27"
  } as const;

  const input = {
    chain: "mainnet",
    quoteToken,
    authorization: mockAuthorization
  };

  it("should parse valid input", () => {
    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, input);

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toEqual({
      ...input,
      authorization: {
        ...mockAuthorization,
        address: "0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29",
        v: 27n
      }
    });
  });
  it("should parse on unknown extra field", () => {
    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, { ...input, unknownField: "extra" });

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toHaveProperty("chain", "mainnet");
    expect(result.output).not.toHaveProperty("unknownField");
  });

  it("should fail on invalid chain", () => {
    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, { ...input, chain: "unknown" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on invalid quoteToken", () => {
    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, { ...input, quoteToken: "invalid" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is missing", () => {
    // arrange
    const { chain: _, ...restInput } = input;

    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, restInput);

    // assert
    expect(result.success).toBe(false);
  });

  it("should parse authorization signed by real account", async () => {
    // arrange
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    const signed = await account.signAuthorization({
      contractAddress: account.address,
      chainId: 1,
      nonce: 0
    });

    const authorization = {
      address: signed.address,
      chainId: signed.chainId,
      nonce: signed.nonce,
      r: signed.r,
      s: signed.s,
      yParity: signed.yParity,
      ...(signed.v !== undefined ? { v: String(signed.v) } : {})
    };

    // act
    const result = v.safeParse(TransferTokenRequestDtoSchema, {
      chain: "mainnet",
      quoteToken: input.quoteToken,
      authorization
    });

    // assert
    expect(result.success).toBe(true);
  });
});
