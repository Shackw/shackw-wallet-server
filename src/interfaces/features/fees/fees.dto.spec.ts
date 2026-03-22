import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { EstimateFeeRequestDtoSchema } from "./fees.dto";

describe("EstimateFeeRequestDtoSchema", () => {
  const input = {
    chain: "mainnet",
    token: { symbol: "JPYC" },
    feeToken: { symbol: "JPYC" },
    amountMinUnits: "1000"
  };

  it("should parse valid input", () => {
    // act
    const result = v.safeParse(EstimateFeeRequestDtoSchema, input);

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toEqual({
      amountMinUnits: 1000n,
      chain: "mainnet",
      feeToken: {
        symbol: "JPYC"
      },
      token: {
        symbol: "JPYC"
      }
    });
  });

  it("should parse on unknown extra field", () => {
    // act
    const result = v.safeParse(EstimateFeeRequestDtoSchema, { ...input, unknownField: "extra" });

    // assert
    expect(result.success).toBe(true);
    expect(result.output).toHaveProperty("chain", "mainnet");
    expect(result.output).not.toHaveProperty("unknownField");
  });

  it("should fail on invalid chain", () => {
    // act
    const result = v.safeParse(EstimateFeeRequestDtoSchema, { ...input, chain: "unknown" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail on non-numeric amountMinUnits", () => {
    // act
    const result = v.safeParse(EstimateFeeRequestDtoSchema, { ...input, amountMinUnits: "abc" });

    // assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is missing", () => {
    // arrange
    const { chain: _, ...restInput } = input;

    // act
    const result = v.safeParse(EstimateFeeRequestDtoSchema, restInput);

    // assert
    expect(result.success).toBe(false);
  });
});
