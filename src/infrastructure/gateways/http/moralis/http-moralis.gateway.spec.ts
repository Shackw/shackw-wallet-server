import { getAddress } from "viem";
import { describe, it, expect } from "vitest";

import { makeMockObject } from "@test/utils";

import type { MoralisSearchTransfersQuery } from "@/application/ports/gateways/moralis.gateway.port";

import { HttpMoralisGateway } from "./http-moralis.gateway";

import type { MoralisSearchTransfersResponseDtoSchema } from "./http-moralis.dto";
import type { AxiosInstance } from "axios";
import type * as v from "valibot";

describe("HttpMoralisGateway", () => {
  describe("searchTransfers", () => {
    const walletAddress = "0xWallet";
    const tokenAddresses = ["0xMainnetJpyc", "0xMainnetUsdc", "0xMainnetEurc"] as const;

    const baseResponseResult: v.InferInput<typeof MoralisSearchTransfersResponseDtoSchema>["result"][number] = {
      token_name: "JPY Coin v2",
      token_symbol: "JPYC",
      token_decimals: "18",
      transaction_hash: "0x2d30ca6f024dbc1307ac8a1a44ca27de6f797ec22ef20627a1307243b0ab7d09",
      address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BF9",
      block_timestamp: "2024-03-15T08:23:11.000Z",
      block_number: "19430000",
      block_hash: "0x1472c302e3c52e8f2e15d155e2c545e6d802e479236564af052759253b20fd86",
      from_address: "0xd4a3BebD824189481FC45363602b83C9c7e9cbDf",
      value: "1000000000000000000000",
      transaction_index: 5,
      log_index: 8,
      possible_spam: false,
      verified_contract: true,
      token_logo: "https://test-logo.png",
      to_address_entity: null,
      to_address_entity_logo: null,
      to_address: "0x62AED87d21Ad0F3cdE4D147Fdcc9245401Af0044",
      to_address_label: null,
      from_address_entity: null,
      from_address_entity_logo: null,
      from_address_label: null
    };

    const baseQuery: MoralisSearchTransfersQuery = {
      chain: "mainnet",
      tokenAddresses: [...tokenAddresses],
      wallet: walletAddress,
      timestampLte: 1_800_000_000,
      timestampGte: 1_900_000_000,
      sortOrder: "desc"
    };

    const mockResponse: v.InferInput<typeof MoralisSearchTransfersResponseDtoSchema> = {
      page: 1,
      page_size: 100,
      cursor: null,
      result: [baseResponseResult]
    };

    it("should return transfers when cursor is null", async () => {
      // arrange
      const resTxHash = "0x2d30ca6f024dbc1307ac8a1a44ca27de6f797ec22ef20627a1307243b0ab7d09";
      const resTokenAddr = "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BF9";
      const resBlockTime = "2024-03-15T08:23:11.000Z";
      const resBlockNum = "19430000";
      const resFromAddr = "0xd4a3BebD824189481FC45363602b83C9c7e9cbDf";
      const resValue = "1000000000000000000000";
      const resLogIdx = 8;
      const resToAddr = "0x62AED87d21Ad0F3cdE4D147Fdcc9245401Af0044";

      const client = makeMockObject<AxiosInstance>({
        get: (url, config) => {
          expect(url).toBe(`/api/v2.2/${walletAddress}/erc20/transfers`);
          expect(config?.params).toEqual({
            chain: "eth",
            from_date: 1_900_000_000,
            to_date: 1_800_000_000,
            order: "DESC",
            limit: 100,
            "contract_addresses[0]": "0xMainnetJpyc",
            "contract_addresses[1]": "0xMainnetUsdc",
            "contract_addresses[2]": "0xMainnetEurc"
          });

          return Promise.resolve({
            data: {
              ...mockResponse,
              result: [
                {
                  ...baseResponseResult,
                  transaction_hash: resTxHash,
                  address: resTokenAddr.toLowerCase(),
                  block_timestamp: resBlockTime,
                  block_number: resBlockNum,
                  from_address: resFromAddr.toLowerCase(),
                  value: resValue,
                  log_index: resLogIdx,
                  to_address: resToAddr
                }
              ]
            }
          } as any);
        }
      });

      const gateway = new HttpMoralisGateway(client);

      // act
      const results = await gateway.searchTransfers(baseQuery);

      // assert
      expect(results).toEqual([
        {
          txHash: resTxHash,
          blockNumber: BigInt(resBlockNum),
          logIndex: resLogIdx,
          tokenAddress: getAddress(resTokenAddr),
          fromAddress: getAddress(resFromAddr),
          toAddress: getAddress(resToAddr),
          valueMinUnits: BigInt(resValue),
          transferredAt: new Date(resBlockTime)
        }
      ]);
    });

    it("should return empty array when result is empty and cursor is null", async () => {
      // arrange
      const client = makeMockObject<AxiosInstance>({
        get: (url, config) => {
          expect(url).toBe(`/api/v2.2/${walletAddress}/erc20/transfers`);
          expect(config?.params).toEqual({
            chain: "eth",
            from_date: 1_900_000_000,
            to_date: 1_800_000_000,
            order: "DESC",
            limit: 100,
            "contract_addresses[0]": "0xMainnetJpyc",
            "contract_addresses[1]": "0xMainnetUsdc",
            "contract_addresses[2]": "0xMainnetEurc"
          });

          return Promise.resolve({
            data: {
              ...mockResponse,
              cursor: null,
              result: []
            }
          } as any);
        }
      });

      const gateway = new HttpMoralisGateway(client);

      // act
      const results = await gateway.searchTransfers(baseQuery);

      // assert
      expect(results).toEqual([]);
    });

    it("should join transfers when cursor is defined", async () => {
      // arrange
      const firstTxHash = `0x${"a".repeat(64)}`;
      const secondTxHash = `0x${"b".repeat(64)}`;
      const thirdTxHash = `0x${"c".repeat(64)}`;

      const firstCursor = "first-cursor";
      const secondCursor = "second-cursor";

      let fetchCount = 0;
      const client = makeMockObject<AxiosInstance>({
        get: (url, config) => {
          expect(url).toBe(`/api/v2.2/${walletAddress}/erc20/transfers`);

          if (fetchCount === 0) {
            fetchCount++;
            expect(config?.params).toEqual({
              chain: "eth",
              from_date: 1_900_000_000,
              to_date: 1_800_000_000,
              order: "DESC",
              limit: 100,
              "contract_addresses[0]": "0xMainnetJpyc",
              "contract_addresses[1]": "0xMainnetUsdc",
              "contract_addresses[2]": "0xMainnetEurc"
            });

            return Promise.resolve({
              data: {
                ...mockResponse,
                page: 1,
                page_size: 1,
                cursor: firstCursor,
                result: [
                  {
                    ...baseResponseResult,
                    transaction_hash: firstTxHash
                  }
                ]
              }
            } as any);
          }

          if (fetchCount === 1) {
            fetchCount++;
            expect(config?.params).toEqual({
              chain: "eth",
              from_date: 1_900_000_000,
              to_date: 1_800_000_000,
              order: "DESC",
              limit: 100,
              cursor: firstCursor,
              "contract_addresses[0]": "0xMainnetJpyc",
              "contract_addresses[1]": "0xMainnetUsdc",
              "contract_addresses[2]": "0xMainnetEurc"
            });

            return Promise.resolve({
              data: {
                ...mockResponse,
                page: 2,
                page_size: 1,
                cursor: secondCursor,
                result: [
                  {
                    ...baseResponseResult,
                    transaction_hash: secondTxHash
                  }
                ]
              }
            } as any);
          }

          fetchCount++;
          expect(config?.params).toEqual({
            chain: "eth",
            from_date: 1_900_000_000,
            to_date: 1_800_000_000,
            order: "DESC",
            limit: 100,
            cursor: secondCursor,
            "contract_addresses[0]": "0xMainnetJpyc",
            "contract_addresses[1]": "0xMainnetUsdc",
            "contract_addresses[2]": "0xMainnetEurc"
          });

          return Promise.resolve({
            data: {
              ...mockResponse,
              page: 3,
              page_size: 1,
              cursor: null,
              result: [
                {
                  ...baseResponseResult,
                  transaction_hash: thirdTxHash
                }
              ]
            }
          } as any);
        }
      });

      const gateway = new HttpMoralisGateway(client);

      // act
      const results = await gateway.searchTransfers(baseQuery);

      // assert
      expect(fetchCount).toBe(3);
      expect(results).toHaveLength(3);
      expect(results[0].txHash).toBe(firstTxHash);
      expect(results[1].txHash).toBe(secondTxHash);
      expect(results[2].txHash).toBe(thirdTxHash);
    });

    it("should map ascending sort order", async () => {
      // arrange
      const client = makeMockObject<AxiosInstance>({
        get: (_url, config) => {
          expect(config?.params).toEqual({
            chain: "eth",
            from_date: 1_900_000_000,
            to_date: 1_800_000_000,
            order: "ASC",
            limit: 100,
            "contract_addresses[0]": "0xMainnetJpyc",
            "contract_addresses[1]": "0xMainnetUsdc",
            "contract_addresses[2]": "0xMainnetEurc"
          });

          return Promise.resolve({
            data: mockResponse
          } as any);
        }
      });

      const gateway = new HttpMoralisGateway(client);

      const query: MoralisSearchTransfersQuery = {
        ...baseQuery,
        sortOrder: "asc"
      };

      // act
      await gateway.searchTransfers(query);
    });
  });
});
