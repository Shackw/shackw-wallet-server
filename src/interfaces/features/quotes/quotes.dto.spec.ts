import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { CreateQuoteRequestDtoSchema } from "./quotes.dto";

describe("CreateQuoteRequestDtoSchema", () => {
  const input = {
    chain: "mainnet",
    sender: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    recipient: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
    token: { symbol: "JPYC" },
    feeToken: { symbol: "JPYC" },
    amountMinUnits: "1000"
  };

  it("should parse valid input", () => {
    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, input);

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toEqual({
      chain: "mainnet",
      sender: "0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29",
      recipient: "0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29",
      token: { symbol: "JPYC" },
      feeToken: { symbol: "JPYC" },
      amountMinUnits: 1000n
    });
  });

  it("should parse on unknown extra field", () => {
    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, { ...input, unknownField: "extra" });

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toHaveProperty("chain", "mainnet");
    expect(result.output).not.toHaveProperty("unknownField");
  });

  it("should fail on invalid chain", () => {
    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, { ...input, chain: "unknown" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on invalid sender address", () => {
    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, { ...input, sender: "invalid" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on non-numeric amountMinUnits", () => {
    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, { ...input, amountMinUnits: "abc" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is missing", () => {
    // arrange
    const { chain: _, ...restInput } = input;

    // act
    const result = v.safeParse(CreateQuoteRequestDtoSchema, restInput);

    // assert
    expect(result.success).toBe(false);
  });
});
