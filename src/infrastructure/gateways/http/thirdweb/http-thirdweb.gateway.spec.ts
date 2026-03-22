import { getAddress } from "viem";
import { describe, it, expect } from "vitest";

import { makeMockObject } from "@test/utils";

import type { ThirdwebSearchContractEventsQuery } from "@/application/ports/gateways/thirdweb.gateway.port";

import { HttpThirdwebApiGateway } from "./http-thirdweb.gateway";

import type { ThirdwebSearchContractEventsResponseDtoSchema } from "./http-thirdweb.dto";
import type { AxiosInstance } from "axios";
import type * as v from "valibot";

describe("HttpThirdwebApiGateway", () => {
  describe("searchContractEvents", () => {
    const ERC20_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

    const chainId = 1;
    const tokenAddress = "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BF9";
    const fromAddress = "0xd4a3BebD824189481FC45363602b83C9c7e9cbDf";
    const toAddress = "0x62AED87d21Ad0F3cdE4D147Fdcc9245401Af0044";

    const baseResponseEvent: v.InferInput<
      typeof ThirdwebSearchContractEventsResponseDtoSchema
    >["result"]["events"][number] = {
      chainId: "1",
      blockNumber: 19430000,
      blockHash: "0x1472c302e3c52e8f2e15d155e2c545e6d802e479236564af052759253b20fd8",
      blockTimestamp: 1710490991,
      transactionHash: "0x2d30ca6f024dbc1307ac8a1a44ca27de6f797ec22ef20627a1307243b0ab7d09",
      transactionIndex: 5,
      logIndex: 8,
      address: tokenAddress,
      data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      topics: [
        ERC20_TRANSFER_TOPIC,
        "0x000000000000000000000000d4a3bebd824189481fc45363602b83c9c7e9cbdf",
        "0x00000000000000000000000062aed87d21ad0f3cde4d147fdcc9245401af0044"
      ],
      decoded: {
        name: "Transfer",
        signature: "Transfer(address,address,uint256)",
        params: {
          from: fromAddress,
          to: toAddress,
          value: "1000000000000000000000"
        }
      }
    };

    const makeMockResponse = (
      overrides: Partial<
        v.InferInput<typeof ThirdwebSearchContractEventsResponseDtoSchema>["result"]["events"][number]
      > = {},
      pagination = { page: 1, limit: 100, totalCount: 1 }
    ) => ({
      result: {
        pagination,
        events: [{ ...baseResponseEvent, ...overrides }]
      }
    });

    it("should return transfers when fromAddress is specified", async () => {
      // arrange
      const resTxHash = "0x2d30ca6f024dbc1307ac8a1a44ca27de6f797ec22ef20627a1307243b0ab7d09";
      const resBlockNum = 19430000;
      const resBlockTimestamp = 1710490991;
      const resValue = "1000000000000000000000";
      const resLogIdx = 8;

      const client = makeMockObject<AxiosInstance>({
        get: (url, config) => {
          expect(url).toBe(`/v1/contracts/${chainId}/${tokenAddress}/events`);
          expect(config?.params).toEqual({
            filterBlockTimestampGte: 1_800_000_000,
            filterBlockTimestampLte: 1_900_000_000,
            sortOrder: "desc",
            limit: 100,
            page: 1,
            filterTopic0: ERC20_TRANSFER_TOPIC,
            filterTopic1: fromAddress
          });

          return Promise.resolve({
            data: makeMockResponse({
              transactionHash: resTxHash,
              blockNumber: resBlockNum,
              blockTimestamp: resBlockTimestamp,
              logIndex: resLogIdx,
              decoded: {
                ...baseResponseEvent.decoded,
                params: { from: fromAddress, to: toAddress, value: resValue }
              }
            })
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        fromAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(results).toEqual([
        {
          txHash: resTxHash,
          blockNumber: BigInt(resBlockNum),
          logIndex: resLogIdx,
          tokenAddress: getAddress(tokenAddress),
          fromAddress: getAddress(fromAddress),
          toAddress: getAddress(toAddress),
          valueMinUnits: BigInt(resValue),
          transferredAt: new Date(resBlockTimestamp * 1000)
        }
      ]);
    });

    it("should return transfers when toAddress is specified", async () => {
      // arrange
      const resTxHash = "0x2d30ca6f024dbc1307ac8a1a44ca27de6f797ec22ef20627a1307243b0ab7d09";
      const resBlockNum = 19430000;
      const resBlockTimestamp = 1710490991;
      const resValue = "1000000000000000000000";
      const resLogIdx = 8;

      const client = makeMockObject<AxiosInstance>({
        get: (url, config) => {
          expect(url).toBe(`/v1/contracts/${chainId}/${tokenAddress}/events`);
          expect(config?.params).toEqual({
            filterBlockTimestampGte: 1_800_000_000,
            filterBlockTimestampLte: 1_900_000_000,
            sortOrder: "desc",
            limit: 100,
            page: 1,
            filterTopic0: ERC20_TRANSFER_TOPIC,
            filterTopic2: toAddress
          });

          return Promise.resolve({
            data: makeMockResponse({
              transactionHash: resTxHash,
              blockNumber: resBlockNum,
              blockTimestamp: resBlockTimestamp,
              logIndex: resLogIdx,
              decoded: {
                ...baseResponseEvent.decoded,
                params: { from: fromAddress, to: toAddress, value: resValue }
              }
            })
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        toAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(results).toEqual([
        {
          txHash: resTxHash,
          blockNumber: BigInt(resBlockNum),
          logIndex: resLogIdx,
          tokenAddress: getAddress(tokenAddress),
          fromAddress: getAddress(fromAddress),
          toAddress: getAddress(toAddress),
          valueMinUnits: BigInt(resValue),
          transferredAt: new Date(resBlockTimestamp * 1000)
        }
      ]);
    });

    it("should search both topic1 and topic2 then deduplicate when fromAddress and toAddress are specified", async () => {
      // arrange
      let callCount = 0;
      const duplicateTxHash = `0x${"d".repeat(64)}`;

      const client = makeMockObject<AxiosInstance>({
        get: (_url, config) => {
          callCount++;

          if (callCount === 1) {
            expect(config?.params).toEqual({
              filterBlockTimestampGte: 1_800_000_000,
              filterBlockTimestampLte: 1_900_000_000,
              sortOrder: "desc",
              limit: 100,
              page: 1,
              filterTopic0: ERC20_TRANSFER_TOPIC,
              filterTopic1: fromAddress
            });
          }

          if (callCount === 2) {
            expect(config?.params).toEqual({
              filterBlockTimestampGte: 1_800_000_000,
              filterBlockTimestampLte: 1_900_000_000,
              sortOrder: "desc",
              limit: 100,
              page: 1,
              filterTopic0: ERC20_TRANSFER_TOPIC,
              filterTopic2: toAddress
            });
          }

          return Promise.resolve({
            data: makeMockResponse({
              transactionHash: duplicateTxHash,
              blockNumber: 19430000,
              blockTimestamp: 1710490991,
              logIndex: 8
            })
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        fromAddress,
        toAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(callCount).toBe(2);
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        txHash: duplicateTxHash,
        blockNumber: 19430000n,
        logIndex: 8
      });
    });

    it("should join transfers when multiple pages exist", async () => {
      // arrange
      const firstTxHash = `0x${"a".repeat(64)}`;
      const secondTxHash = `0x${"b".repeat(64)}`;
      const thirdTxHash = `0x${"c".repeat(64)}`;
      const forceTxHash = `0x${"e".repeat(64)}`;

      let fetchCount = 0;
      const client = makeMockObject<AxiosInstance>({
        get: (_url, config) => {
          if (fetchCount === 0) {
            fetchCount++;
            return Promise.resolve({
              data: {
                result: {
                  pagination: { page: 1, limit: 3, totalCount: 9 },
                  events: [
                    {
                      ...baseResponseEvent,
                      transactionHash: firstTxHash,
                      blockTimestamp: 1710490993,
                      blockNumber: 3,
                      logIndex: 8
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: firstTxHash,
                      blockTimestamp: 1710490993,
                      blockNumber: 1,
                      logIndex: 8
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: firstTxHash,
                      blockTimestamp: 1710490993,
                      blockNumber: 2,
                      logIndex: 8
                    }
                  ]
                }
              }
            } as any);
          } else if (fetchCount === 1) {
            fetchCount++;
            expect(config?.params).toHaveProperty("page", 2);
            return Promise.resolve({
              data: {
                result: {
                  pagination: { page: 2, limit: 3, totalCount: 9 },
                  events: [
                    {
                      ...baseResponseEvent,
                      transactionHash: secondTxHash,
                      blockTimestamp: 1710490992,
                      blockNumber: 2,
                      logIndex: 100
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: secondTxHash,
                      blockTimestamp: 1710490992,
                      blockNumber: 2,
                      logIndex: 95
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: thirdTxHash,
                      blockTimestamp: 1710490994,
                      blockNumber: 10,
                      logIndex: 2
                    }
                  ]
                }
              }
            } as any);
          } else if (fetchCount === 2) {
            fetchCount++;
            expect(config?.params).toHaveProperty("page", 3);
            return Promise.resolve({
              data: {
                result: {
                  pagination: { page: 3, limit: 3, totalCount: 9 },
                  events: [
                    {
                      ...baseResponseEvent,
                      transactionHash: thirdTxHash,
                      blockTimestamp: 1710490994,
                      blockNumber: 10,
                      logIndex: 1
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: forceTxHash,
                      blockTimestamp: 1710490995,
                      blockNumber: 10,
                      logIndex: 1
                    },
                    {
                      ...baseResponseEvent,
                      transactionHash: forceTxHash,
                      blockTimestamp: 1710490995,
                      blockNumber: 10,
                      logIndex: 1
                    }
                  ]
                }
              }
            } as any);
          }

          fetchCount++;
          expect(config?.params).toHaveProperty("page", 4);
          return Promise.resolve({
            data: {
              result: {
                pagination: { page: 4, limit: 3, totalCount: 9 },
                events: []
              }
            }
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        fromAddress,
        timestampGte: 1_700_000_000,
        timestampLte: 1_800_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(fetchCount).toBe(3);
      expect(results).toHaveLength(8);

      expect(
        results.map(result => ({
          txHash: result.txHash,
          blockNumber: result.blockNumber,
          logIndex: result.logIndex,
          transferredAt: result.transferredAt
        }))
      ).toEqual([
        {
          txHash: forceTxHash,
          blockNumber: 10n,
          logIndex: 1,
          transferredAt: new Date("2024-03-15T08:23:15.000Z")
        },
        {
          txHash: thirdTxHash,
          blockNumber: 10n,
          logIndex: 2,
          transferredAt: new Date("2024-03-15T08:23:14.000Z")
        },
        {
          txHash: thirdTxHash,
          blockNumber: 10n,
          logIndex: 1,
          transferredAt: new Date("2024-03-15T08:23:14.000Z")
        },
        {
          txHash: firstTxHash,
          blockNumber: 3n,
          logIndex: 8,
          transferredAt: new Date("2024-03-15T08:23:13.000Z")
        },
        {
          txHash: firstTxHash,
          blockNumber: 2n,
          logIndex: 8,
          transferredAt: new Date("2024-03-15T08:23:13.000Z")
        },
        {
          txHash: firstTxHash,
          blockNumber: 1n,
          logIndex: 8,
          transferredAt: new Date("2024-03-15T08:23:13.000Z")
        },
        {
          txHash: secondTxHash,
          blockNumber: 2n,
          logIndex: 100,
          transferredAt: new Date("2024-03-15T08:23:12.000Z")
        },
        {
          txHash: secondTxHash,
          blockNumber: 2n,
          logIndex: 95,
          transferredAt: new Date("2024-03-15T08:23:12.000Z")
        }
      ]);
    });

    it("should merge transfers across multiple token addresses and sort them globally", async () => {
      // arrange
      const tokenAddress2 = "0x62AED87d21Ad0F3cdE4D147Fdcc9245401Af0044";
      const firstTxHash = `0x${"a".repeat(64)}`;
      const secondTxHash = `0x${"b".repeat(64)}`;

      let callCount = 0;
      const client = makeMockObject<AxiosInstance>({
        get: url => {
          callCount++;

          if (url === `/v1/contracts/${chainId}/${tokenAddress}/events`) {
            return Promise.resolve({
              data: {
                result: {
                  pagination: { page: 1, limit: 100, totalCount: 1 },
                  events: [
                    {
                      ...baseResponseEvent,
                      address: tokenAddress,
                      transactionHash: firstTxHash,
                      blockTimestamp: 1710490991,
                      blockNumber: 1,
                      logIndex: 1
                    }
                  ]
                }
              }
            } as any);
          }

          return Promise.resolve({
            data: {
              result: {
                pagination: { page: 1, limit: 100, totalCount: 1 },
                events: [
                  {
                    ...baseResponseEvent,
                    address: tokenAddress2,
                    transactionHash: secondTxHash,
                    blockTimestamp: 1710490992,
                    blockNumber: 2,
                    logIndex: 2
                  }
                ]
              }
            }
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress, tokenAddress2],
        fromAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(callCount).toBe(2);
      expect(results).toHaveLength(2);
      expect(
        results.map(result => ({
          txHash: result.txHash,
          tokenAddress: result.tokenAddress,
          blockNumber: result.blockNumber,
          logIndex: result.logIndex,
          transferredAt: result.transferredAt
        }))
      ).toEqual([
        {
          txHash: secondTxHash,
          tokenAddress: getAddress(tokenAddress2),
          blockNumber: 2n,
          logIndex: 2,
          transferredAt: new Date("2024-03-15T08:23:12.000Z")
        },
        {
          txHash: firstTxHash,
          tokenAddress: getAddress(tokenAddress),
          blockNumber: 1n,
          logIndex: 1,
          transferredAt: new Date("2024-03-15T08:23:11.000Z")
        }
      ]);
    });

    it("should deduplicate same transfer returned from different token addresses by txHash, blockNumber and logIndex", async () => {
      // arrange
      const tokenAddress2 = "0x62AED87d21Ad0F3cdE4D147Fdcc9245401Af0044";
      const duplicateTxHash = `0x${"f".repeat(64)}`;

      const client = makeMockObject<AxiosInstance>({
        get: url => {
          const address = url.includes(tokenAddress2) ? tokenAddress2 : tokenAddress;

          return Promise.resolve({
            data: {
              result: {
                pagination: { page: 1, limit: 100, totalCount: 1 },
                events: [
                  {
                    ...baseResponseEvent,
                    address,
                    transactionHash: duplicateTxHash,
                    blockTimestamp: 1710490991,
                    blockNumber: 19430000,
                    logIndex: 8
                  }
                ]
              }
            }
          } as any);
        }
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress, tokenAddress2],
        fromAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        txHash: duplicateTxHash,
        blockNumber: 19430000n,
        logIndex: 8
      });
    });

    it("should sort transfers in ascending order", async () => {
      // arrange
      const oldTxHash = `0x${"a".repeat(64)}`;
      const newTxHash = `0x${"b".repeat(64)}`;

      const client = makeMockObject<AxiosInstance>({
        get: () =>
          Promise.resolve({
            data: {
              result: {
                pagination: { page: 1, limit: 100, totalCount: 2 },
                events: [
                  {
                    ...baseResponseEvent,
                    transactionHash: newTxHash,
                    blockTimestamp: 1710490992,
                    blockNumber: 2,
                    logIndex: 1
                  },
                  {
                    ...baseResponseEvent,
                    transactionHash: oldTxHash,
                    blockTimestamp: 1710490991,
                    blockNumber: 1,
                    logIndex: 0
                  }
                ]
              }
            }
          } as any)
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        fromAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "asc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(
        results.map(result => ({
          txHash: result.txHash,
          blockNumber: result.blockNumber,
          logIndex: result.logIndex,
          transferredAt: result.transferredAt
        }))
      ).toEqual([
        {
          txHash: oldTxHash,
          blockNumber: 1n,
          logIndex: 0,
          transferredAt: new Date("2024-03-15T08:23:11.000Z")
        },
        {
          txHash: newTxHash,
          blockNumber: 2n,
          logIndex: 1,
          transferredAt: new Date("2024-03-15T08:23:12.000Z")
        }
      ]);
    });

    it("should sort transfers in descending order", async () => {
      // arrange
      const oldTxHash = `0x${"a".repeat(64)}`;
      const newTxHash = `0x${"b".repeat(64)}`;

      const client = makeMockObject<AxiosInstance>({
        get: () =>
          Promise.resolve({
            data: {
              result: {
                pagination: { page: 1, limit: 100, totalCount: 2 },
                events: [
                  {
                    ...baseResponseEvent,
                    transactionHash: oldTxHash,
                    blockTimestamp: 1710490991,
                    blockNumber: 1,
                    logIndex: 0
                  },
                  {
                    ...baseResponseEvent,
                    transactionHash: newTxHash,
                    blockTimestamp: 1710490992,
                    blockNumber: 2,
                    logIndex: 1
                  }
                ]
              }
            }
          } as any)
      });

      const gateway = new HttpThirdwebApiGateway(client);

      const query: ThirdwebSearchContractEventsQuery = {
        chainId,
        tokenAddresses: [tokenAddress],
        fromAddress,
        timestampGte: 1_800_000_000,
        timestampLte: 1_900_000_000,
        sortOrder: "desc"
      };

      // act
      const results = await gateway.searchContractEvents(query);

      // assert
      expect(
        results.map(result => ({
          txHash: result.txHash,
          blockNumber: result.blockNumber,
          logIndex: result.logIndex,
          transferredAt: result.transferredAt
        }))
      ).toEqual([
        {
          txHash: newTxHash,
          blockNumber: 2n,
          logIndex: 1,
          transferredAt: new Date("2024-03-15T08:23:12.000Z")
        },
        {
          txHash: oldTxHash,
          blockNumber: 1n,
          logIndex: 0,
          transferredAt: new Date("2024-03-15T08:23:11.000Z")
        }
      ]);
    });
  });
});
