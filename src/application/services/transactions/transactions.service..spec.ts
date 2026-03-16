import { describe, it, expect } from "vitest";

import type {
  ChainToTokenSupportInput,
  ChainToTokenSupportOutput
} from "@/application/policies/chain-to-token-support";
import { ChainToTokenSupportPolicy } from "@/application/policies/chain-to-token-support";
import type {
  MoralisGateway,
  MoralisSearchTransfersContract,
  MoralisSearchTransfersQuery
} from "@/application/ports/gateways/moralis.gateway.port";
import type {
  ThirdwebGateway,
  ThirdwebSearchContractEventsContract,
  ThirdwebSearchContractEventsQuery
} from "@/application/ports/gateways/thirdweb.gateway.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { TransactionsService } from "./transactions.service";

import type { SearchTransactionsInput } from "./transactions.service.types";
import type { Address } from "viem";

describe("TransactionsService", () => {
  describe("searchTransactions", () => {
    const baseEventsContract: ThirdwebSearchContractEventsContract = {
      txHash: "0xTxHash1",
      blockNumber: 100n,
      logIndex: 0,
      tokenAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      fromAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      toAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      valueMinUnits: 1000n,
      transferredAt: new Date("2025-01-01T00:00:00Z")
    };

    const baseTransfersContract: MoralisSearchTransfersContract = {
      txHash: "0xTxHash1",
      blockNumber: 100n,
      logIndex: 0,
      tokenAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      fromAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      toAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      valueMinUnits: 1000n,
      transferredAt: new Date("2025-01-01T00:00:00Z")
    };

    it("should return only inbound transactions when searchDirection is 'in' via thirdweb", async () => {
      // arrange
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

      class TestThirdwebGateway implements ThirdwebGateway {
        searchContractEvents(
          query: ThirdwebSearchContractEventsQuery
        ): Promise<ThirdwebSearchContractEventsContract[]> {
          expect(query).toEqual({
            chainId: 1,
            tokenAddresses: [tokenAddress],
            timestampLte: 1735863400,
            timestampGte: 1735688600,
            sortOrder: "desc",
            toAddress: requester
          });

          return Promise.resolve([
            {
              ...baseEventsContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      class TestMoralisGateway implements MoralisGateway {
        searchTransfers(_query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
          return Promise.resolve([{ ...baseTransfersContract, tokenAddress, toAddress: requester }]);
        }
      }

      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
          return {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            },
            token: { address: tokenAddress, symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        }
      }

      const thirdwebApiGateway = new TestThirdwebGateway();
      const moralisApiGateway = new TestMoralisGateway();
      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transactions = new TransactionsService(thirdwebApiGateway, moralisApiGateway, chainToTokenSupport);

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "in"
      };

      // act
      const results = await transactions.searchTransactions(input);

      // assert
      expect(results).toEqual([
        {
          txHash: "0xTxHash1",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should return only outboud transactions when searchDirection is 'out' via thirdweb", async () => {
      // arrange
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

      class TestThirdwebGateway implements ThirdwebGateway {
        searchContractEvents(
          query: ThirdwebSearchContractEventsQuery
        ): Promise<ThirdwebSearchContractEventsContract[]> {
          expect(query).toEqual({
            chainId: 1,
            tokenAddresses: [tokenAddress],
            timestampLte: 1735863400,
            timestampGte: 1735688600,
            sortOrder: "desc",
            fromAddress: requester
          });

          return Promise.resolve([
            {
              ...baseEventsContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      class TestMoralisGateway implements MoralisGateway {
        searchTransfers(_query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
          return Promise.resolve([{ ...baseTransfersContract, tokenAddress, toAddress: requester }]);
        }
      }

      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
          return {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            },
            token: { address: tokenAddress, symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        }
      }

      const thirdwebApiGateway = new TestThirdwebGateway();
      const moralisApiGateway = new TestMoralisGateway();
      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transactions = new TransactionsService(thirdwebApiGateway, moralisApiGateway, chainToTokenSupport);

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "out"
      };

      // act
      const results = await transactions.searchTransactions(input);

      // assert
      expect(results).toEqual([
        {
          txHash: "0xTxHash2",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "out",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should return only both direction transactions when searchDirection is 'both' via thirdweb'", async () => {
      // arrange
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

      class TestThirdwebGateway implements ThirdwebGateway {
        searchContractEvents(
          query: ThirdwebSearchContractEventsQuery
        ): Promise<ThirdwebSearchContractEventsContract[]> {
          expect(query).toEqual({
            chainId: 1,
            tokenAddresses: [tokenAddress],
            timestampLte: 1735863400,
            timestampGte: 1735688600,
            sortOrder: "desc",
            toAddress: requester,
            fromAddress: requester
          });

          return Promise.resolve([
            {
              ...baseEventsContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      class TestMoralisGateway implements MoralisGateway {
        searchTransfers(_query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
          return Promise.resolve([{ ...baseTransfersContract, tokenAddress, toAddress: requester }]);
        }
      }

      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
          return {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            },
            token: { address: tokenAddress, symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        }
      }

      const thirdwebApiGateway = new TestThirdwebGateway();
      const moralisApiGateway = new TestMoralisGateway();
      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transactions = new TransactionsService(thirdwebApiGateway, moralisApiGateway, chainToTokenSupport);

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "both"
      };

      // act
      const results = await transactions.searchTransactions(input);

      // assert
      expect(results).toEqual([
        {
          txHash: "0xTxHash1",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash2",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "out",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should return only inbound transactions when searchDirection is 'in' via moralis fallback", async () => {
      // arrange
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

      class TestThirdwebGateway implements ThirdwebGateway {
        searchContractEvents(
          _query: ThirdwebSearchContractEventsQuery
        ): Promise<ThirdwebSearchContractEventsContract[]> {
          return Promise.reject(new Error("on error when fetching events via thirdweb"));
        }
      }

      class TestMoralisGateway implements MoralisGateway {
        searchTransfers(query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
          expect(query).toEqual({
            chain: "mainnet",
            tokenAddresses: [tokenAddress],
            wallet: requester,
            timestampLte: 1735863400,
            timestampGte: 1735688600,
            sortOrder: "desc"
          });

          return Promise.resolve([
            {
              ...baseEventsContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseEventsContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      class TestChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
          return {
            chain: {
              id: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey].id,
              key: input.chainKey,
              rpcUrl: `https://test-rpc.com/${input.chainKey}`,
              viem: CHAIN_KEY_TO_VIEM_CHAIN[input.chainKey]
            },
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            },
            token: { address: tokenAddress, symbol: "JPYC", currency: "JPY", decimals: 18 },
            minTransferAmountUnits: 1000000000000000000000n,
            fixedFeeAmountUnits: 100000000000000000000n
          };
        }
      }

      const thirdwebApiGateway = new TestThirdwebGateway();
      const moralisApiGateway = new TestMoralisGateway();
      const chainToTokenSupport = new TestChainToTokenSupportPolicy();
      const transactions = new TransactionsService(thirdwebApiGateway, moralisApiGateway, chainToTokenSupport);

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "in",
        limit: 1
      };

      // act
      const results = await transactions.searchTransactions(input);

      // assert
      expect(results).toEqual([
        {
          txHash: "0xTxHash1",
          blockNumber: 100n,
          logIndex: 0,
          token: {
            symbol: "JPYC",
            address: tokenAddress,
            decimals: 18
          },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });
  });
});
