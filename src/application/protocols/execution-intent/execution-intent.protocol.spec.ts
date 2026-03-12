import { describe, it, expect } from "vitest";

import { buildExcutionIntent } from "./execution-intent.protocol";

import type { BuildExecutionIntentInput } from "./execution-intent.protocol.types";
import type { Address } from "viem";

describe("ExecutionIntentProtocol", () => {
  describe("buildExcutionIntent", () => {
    const baseInput: BuildExecutionIntentInput = {
      chainId: 1,
      sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amountMinUnits: 1_000_000n,
      feeToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      sponsor: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      feeMinUnits: 10_000n,
      nonce: 1n,
      expiresAtSec: 1_800_000_000n
    };

    const assertValue = {
      calls: [
        {
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 0n,
          data: "0xa9059cbb0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000000000000f4240"
        },
        {
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 0n,
          data: "0xa9059cbb0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000000000000000002710"
        }
      ],
      callHash: "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76"
    } as const;

    it("should succeed with checksum addresses", () => {
      // act
      const result = buildExcutionIntent(baseInput);

      // assert
      expect(result).toEqual(assertValue);
    });

    it("should succeed with lowercase addresses", () => {
      // arrange
      const input: BuildExecutionIntentInput = {
        ...baseInput,
        sender: baseInput.sender.toLowerCase() as Address,
        recipient: baseInput.recipient.toLowerCase() as Address,
        token: baseInput.token.toLowerCase() as Address,
        feeToken: baseInput.feeToken.toLowerCase() as Address,
        sponsor: baseInput.sponsor.toLowerCase() as Address
      };

      // act
      const result = buildExcutionIntent(input);

      // assert
      expect(result).toEqual(assertValue);
    });
  });
});
