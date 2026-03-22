import { describe, it, expect, vi } from "vitest";

import { makeClient } from "@test/utils";

import type { DelegateExecuteQuery } from "@/application/ports/adapters/sponsor.adapter.port";

import { ViemSponsorAdapter } from "./viem-sponsor.adapter";

import type { ViemPublicClientFactory } from "../viem-public-client.factory";
import type { ViemSponsorWalletClientFactory } from "../viem-sponsor-client.factory";
import type { Account, PublicClient, Transport, WalletClient, Chain as ViemChain } from "viem";

vi.mock("viem", async importOriginal => ({
  ...(await importOriginal<typeof import("viem")>()),
  getContract: vi.fn()
}));

describe("ViemSponsorAdapter", () => {
  describe("simulateDelegateExecute", () => {
    it("should call simulateContract with the correct arguments", async () => {
      // arrange
      const expectedSponsorAddress = "0xMainnetSponsor";

      const query: DelegateExecuteQuery = {
        sponsor: expectedSponsorAddress,
        chainKey: "mainnet",
        sender: "0xSender",
        calls: [
          {
            to: "0xToAddress1",
            value: 100n,
            data: "0xData1"
          },
          {
            to: "0xToAddress2",
            value: 10n,
            data: "0xData2"
          }
        ],
        nonce: 1000n,
        expiresAt: 0n,
        callHash: "0xCallHash",
        authorization: {
          chainId: 1,
          address: "0xDelegate",
          nonce: 100,
          r: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          s: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          v: 27n
        }
      };

      const publicClientFactor = makeClient<ViemPublicClientFactory>({
        get(chainKey: string) {
          expect(chainKey).toBe(query.chainKey);

          return {
            simulateContract: (tx: object) => {
              expect(tx).toEqual(
                expect.objectContaining({
                  account: expectedSponsorAddress,
                  address: query.sender,
                  args: [query.calls, query.nonce, 0n, query.callHash],
                  authorizationList: [query.authorization]
                })
              );
              return Promise.resolve();
            }
          } as unknown as PublicClient;
        }
      });

      const walletClientFactory = makeClient<ViemSponsorWalletClientFactory>({
        get(_chainKey: string) {
          return {} as unknown as WalletClient<Transport, ViemChain, Account>;
        }
      });

      const adapter = new ViemSponsorAdapter(publicClientFactor, walletClientFactory);

      // act & assert
      await expect(adapter.simulateDelegateExecute(query)).resolves.toBeUndefined();
    });
  });

  describe("writeDelegateExecute", () => {
    it("should call simulateContract with the correct arguments", async () => {
      // arrange
      const expectedSponsorAddress = "0xSponsorAddress";
      const expectedResultTxHash = "0xResultTxHash";

      const query: DelegateExecuteQuery = {
        sponsor: expectedSponsorAddress,
        chainKey: "mainnet",
        sender: "0xSender",
        calls: [
          {
            to: "0xToAddress1",
            value: 100n,
            data: "0xData1"
          },
          {
            to: "0xToAddress2",
            value: 10n,
            data: "0xData2"
          }
        ],
        nonce: 1000n,
        expiresAt: 0n,
        callHash: "0xCallHash",
        authorization: {
          chainId: 1,
          address: "0xDelegate",
          nonce: 100,
          r: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          s: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          v: 27n
        }
      };

      const publicClientFactor = makeClient<ViemPublicClientFactory>({
        get(_chainKey: string) {
          return {} as unknown as PublicClient;
        }
      });

      const walletClientFactory = makeClient<ViemSponsorWalletClientFactory>({
        get(chainKey: string) {
          expect(chainKey).toBe(query.chainKey);
          return {
            writeContract: (tx: object) => {
              expect(tx).toEqual(
                expect.objectContaining({
                  account: expectedSponsorAddress,
                  address: query.sender,
                  args: [query.calls, query.nonce, 0n, query.callHash],
                  authorizationList: [query.authorization]
                })
              );
              return Promise.resolve(expectedResultTxHash);
            }
          } as unknown as WalletClient<Transport, ViemChain, Account>;
        }
      });

      const adapter = new ViemSponsorAdapter(publicClientFactor, walletClientFactory);

      // act
      const result = await adapter.writeDelegateExecute(query);

      // assert
      expect(result).toBe(expectedResultTxHash);
    });
  });
});
