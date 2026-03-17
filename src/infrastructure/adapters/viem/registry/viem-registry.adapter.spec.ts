import { getContract } from "viem";
import { describe, it, expect, vi } from "vitest";

import { makeClient } from "@test/utils";

import type { GetNextNonceQuery } from "@/application/ports/adapters/registry.adapter.port";
import type { Chain } from "@/domain/constants/chain.constant";

import { ViemRegistryAdapter } from "./viem-registry.adapter";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";
import type { Address, PublicClient } from "viem";

vi.mock("viem", async importOriginal => ({
  ...(await importOriginal<typeof import("viem")>()),
  getContract: vi.fn()
}));

describe("ViemRegistryAdapter", () => {
  describe("getNextNonce", () => {
    it("should return the nonce of the owner", async () => {
      // arrange
      const expectedNonce = 1220n;

      const query: GetNextNonceQuery = {
        chainKey: "mainnet",
        owner: "0xOwnerAddress"
      };

      class TestViemRegistryAdapter extends ViemRegistryAdapter {
        protected override async _getRegistryAddress(chainKey: Chain): Promise<Address> {
          expect(chainKey).toBe(query.chainKey);

          return Promise.resolve("0xRegistryAddress");
        }
      }

      vi.mocked(getContract).mockReturnValue({
        read: {
          nextNonce: ([owner]: [`0x${string}`]) => {
            expect(owner).toBe(query.owner);
            return Promise.resolve(expectedNonce);
          }
        }
      } as unknown as ReturnType<typeof getContract>);

      const factory = makeClient<ViemPublicClientFactory>({
        get(chainKey: string) {
          expect(chainKey).toBe(query.chainKey);
          return {} as PublicClient;
        }
      });

      const adapter = new TestViemRegistryAdapter(factory);

      // act & assert
      await expect(adapter.getNextNonce(query)).resolves.toBe(expectedNonce);
    });
  });
});
