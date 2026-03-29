import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { SearchTransactionsRequestDtoSchema } from "./transactions.dto";

describe("SearchTransactionsRequestDtoSchema", () => {
  const rawAddress = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";
  const checksumAddress = "0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29";

  const input = {
    chain: "mainnet",
    tokens: [{ symbol: "JPYC" }],
    wallet: rawAddress,
    timestampGte: 1_000_000_000,
    timestampLte: 1_000_000_001,
    direction: "in"
  };

  it("should parse valid input", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, input);

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toEqual({
      ...input,
      wallet: checksumAddress,
      limit: undefined
    });
  });

  it("should parse on unknown extra field", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, unknownField: "extra" });

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toHaveProperty("chain", "mainnet");
    expect(result.output).not.toHaveProperty("unknownField");
  });

  it("should fail on invalid chain", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, chain: "unknown" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on invalid wallet address", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, wallet: "invalid" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on invalid direction", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, direction: "unknown" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when timestampLte is less than timestampGte", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, {
      ...input,
      timestampGte: 1_000_000_001,
      timestampLte: 1_000_000_000
    });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when timestampGte is below valid unix timestamp", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, timestampGte: 999_999_999 });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is missing", () => {
    // arrange
    const { chain: _, ...restInput } = input;

    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, restInput);

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when tokens is empty", () => {
    // act
    const result = v.safeParse(SearchTransactionsRequestDtoSchema, { ...input, tokens: [] });

    // assert
    expect(result.success).toBe(false);
  });
});
