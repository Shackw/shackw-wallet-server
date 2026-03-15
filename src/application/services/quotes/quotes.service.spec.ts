import { describe, it, expect } from "vitest";

import { StubRegistryAdapter } from "@test/doubles/adapters/stub-registry.adapter";

import { DefaultBalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import { DefaultChainToTokenSupportPolicy } from "@/application/policies/chain-to-token-support";
import { DefaultTransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import type { GetNextNonceQuery } from "@/application/ports/adapters/registry.adapter.port";

import { QuotesService } from "./quotes.service";

describe("QuotesService", () => {
  describe("createQuote", () => {
    it("should throw FAILED_TO_FETCH_NEXT_NONCE when fetching the next nonce fails", async () => {
      // arrange
      class TestRegistryAdap extends StubRegistryAdapter {
        getNextNonce(_query: GetNextNonceQuery): Promise<bigint> {
          throw new Error("error");
        }
      }

      const testRegistryAdap = new TestRegistryAdap();
      const chainToTokenSupport = new DefaultChainToTokenSupportPolicy();
      const transferEligibility = new DefaultTransferEligibilityPolicy(chainToTokenSupport);
      const balanceSufficiency = new DefaultBalanceSufficiencyPolicy(stubTokenDepRepo);
      const quoteService = new QuotesService("0xQuoteTokenSecret", testRegistryAdap, transferEligibility);

      expect();
    });
  });
});
