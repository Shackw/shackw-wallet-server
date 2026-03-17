import { getContract } from "viem";
import { describe, it, expect, vi } from "vitest";

import { makeClient } from "@test/utils";

import type { GetBalanceQuery } from "@/application/ports/adapters/erc20.adapter.port";

import { ViemErc20Adapter } from "./viem-erc20.adapter";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";
import type { PublicClient } from "viem";

vi.mock("viem", async importOriginal => ({
  ...(await importOriginal<typeof import("viem")>()),
  getContract: vi.fn()
}));

describe("ViemErc20Adapter", () => {
  describe("getBalance", () => {
    it("should return the balance of the owner", async () => {
      // arrange
      const expectedBalance = 1000n;

      const query: GetBalanceQuery = {
        chainKey: "mainnet",
        tokenAddress: "0xTokenAddress",
        owner: "0xOwnerAddress"
      };

      vi.mocked(getContract).mockReturnValue({
        read: {
          balanceOf: ([owner]: [`0x${string}`]) => {
            expect(owner).toBe(query.owner);
            return Promise.resolve(expectedBalance);
          }
        }
      } as unknown as ReturnType<typeof getContract>);

      const factory = makeClient<ViemPublicClientFactory>({
        get(chainKey: string) {
          expect(chainKey).toBe(query.chainKey);
          return {} as PublicClient;
        }
      });
      const adapter = new ViemErc20Adapter(factory);

      // act & assert
      await expect(adapter.getBalance(query)).resolves.toBe(expectedBalance);
    });
  });
});
