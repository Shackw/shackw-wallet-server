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
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { TransactionsService } from "./transactions.service";

import type { SearchTransactionsInput } from "./transactions.service.types";
import type { Address } from "viem";

describe("TransactionsService", () => {
  describe("searchTransactions", () => {
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

    const makeChainToTokenSupportPolicy = (tokenAddress: Address) =>
      new (class extends ChainToTokenSupportPolicy {
        execute(input: ChainToTokenSupportInput): Promise<ChainToTokenSupportOutput> {
          return Promise.resolve({
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
          });
        }
      })();

    it("should return only inbound transactions when searchDirection is 'in'", async () => {
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

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
              ...baseTransfersContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      const transactions = new TransactionsService(
        new TestMoralisGateway(),
        makeChainToTokenSupportPolicy(tokenAddress)
      );

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "in"
      };

      const results = await transactions.searchTransactions(input);

      expect(results).toEqual([
        {
          txHash: "0xTxHash1",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should return only outbound transactions when searchDirection is 'out'", async () => {
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

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
              ...baseTransfersContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      const transactions = new TransactionsService(
        new TestMoralisGateway(),
        makeChainToTokenSupportPolicy(tokenAddress)
      );

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "out"
      };

      const results = await transactions.searchTransactions(input);

      expect(results).toEqual([
        {
          txHash: "0xTxHash2",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "out",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should return both directions when searchDirection is 'both'", async () => {
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

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
              ...baseTransfersContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: counterparty,
              fromAddress: requester
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash3",
              tokenAddress,
              toAddress: requester,
              fromAddress: requester
            }
          ]);
        }
      }

      const transactions = new TransactionsService(
        new TestMoralisGateway(),
        makeChainToTokenSupportPolicy(tokenAddress)
      );

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "both"
      };

      const results = await transactions.searchTransactions(input);

      expect(results).toEqual([
        {
          txHash: "0xTxHash1",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "in",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash2",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "out",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: counterparty },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        },
        {
          txHash: "0xTxHash3",
          blockNumber: 100n,
          logIndex: 0,
          token: { symbol: "JPYC", address: tokenAddress, decimals: 18 },
          direction: "self",
          value: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
          counterparty: { address: requester },
          transferredAt: new Date("2025-01-01T00:00:00.000Z")
        }
      ]);
    });

    it("should respect limit", async () => {
      const requester: Address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
      const counterparty: Address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      const tokenAddress: Address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

      class TestMoralisGateway implements MoralisGateway {
        searchTransfers(_query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]> {
          return Promise.resolve([
            {
              ...baseTransfersContract,
              txHash: "0xTxHash1",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            },
            {
              ...baseTransfersContract,
              txHash: "0xTxHash2",
              tokenAddress,
              toAddress: requester,
              fromAddress: counterparty
            }
          ]);
        }
      }

      const transactions = new TransactionsService(
        new TestMoralisGateway(),
        makeChainToTokenSupportPolicy(tokenAddress)
      );

      const input: SearchTransactionsInput = {
        chainKey: "mainnet",
        tokenSymbols: ["JPYC"],
        walletAddress: requester,
        timestampGte: 1735688600,
        timestampLte: 1735863400,
        searchDirection: "in",
        limit: 1
      };

      const results = await transactions.searchTransactions(input);

      expect(results).toHaveLength(1);
      expect(results[0]?.txHash).toBe("0xTxHash1");
    });
  });
});
