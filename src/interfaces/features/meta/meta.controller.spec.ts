import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { makeMockObject } from "@test/utils";

import type { MetaService } from "@/application/services/meta";
import type {
  ChainMetaEntity,
  TokenMetaEntity,
  FeeMetaEntity,
  MinTransferMetaEntity,
  ContractsMetaEntity,
  MetaSummaryEntity
} from "@/domain/entities/meta.entity";

import { MetaController } from "./meta.controller";

describe("MetaController", () => {
  const rawAddress = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

  const mockChains: ChainMetaEntity[] = [{ key: "mainnet", id: 1, testnet: false }];

  const mockTokens: TokenMetaEntity[] = [{ symbol: "JPYC", address: { mainnet: rawAddress }, decimals: 18 }];

  const mockFees: FeeMetaEntity[] = [
    { chainKey: "mainnet", tokenSymbol: "JPYC", fixedFeeAmountUnits: 100n, fixedFeeAmountDisplay: 0.0001 }
  ];

  const mockMinTransfers: MinTransferMetaEntity[] = [
    { chainKey: "mainnet", tokenSymbol: "JPYC", minTransferAmountUnits: 1000n, minTransferAmountDisplay: 0.001 }
  ];

  const mockContracts = {
    delegate: { mainnet: rawAddress },
    registry: { mainnet: rawAddress },
    sponsor: { mainnet: rawAddress }
  } as unknown as ContractsMetaEntity;

  const mockSummary: MetaSummaryEntity = {
    schemaVersion: "v1",
    chains: mockChains,
    tokens: mockTokens,
    fixedFees: mockFees,
    minTransfers: mockMinTransfers,
    contracts: mockContracts
  };

  describe("summary", () => {
    it("should return meta summary response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getMetaSummary: () => Promise.resolve(mockSummary)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.summary();

      // assert
      expect(res).toEqual({
        schemaVersion: "v1",
        chains: [{ key: "mainnet", id: 1, testnet: false }],
        tokens: [{ symbol: "JPYC", address: { mainnet: getAddress(rawAddress) }, decimals: 18 }],
        fixedFees: [
          { chainKey: "mainnet", tokenSymbol: "JPYC", fixedFeeAmountUnits: 100n, fixedFeeAmountDisplay: 0.0001 }
        ],
        minTransfers: [
          { chainKey: "mainnet", tokenSymbol: "JPYC", minTransferAmountUnits: 1000n, minTransferAmountDisplay: 0.001 }
        ],
        contracts: {
          delegate: { mainnet: getAddress(rawAddress) },
          registry: { mainnet: getAddress(rawAddress) },
          sponsor: { mainnet: getAddress(rawAddress) }
        }
      });
    });
  });

  describe("chains", () => {
    it("should return chains meta response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getChainsMeta: () => Promise.resolve(mockChains)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.chains();

      // assert
      expect(res).toEqual([{ key: "mainnet", id: 1, testnet: false }]);
    });
  });

  describe("tokens", () => {
    it("should return tokens meta response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getTokensMeta: () => Promise.resolve(mockTokens)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.tokens();

      // assert
      expect(res).toEqual([{ symbol: "JPYC", address: { mainnet: getAddress(rawAddress) }, decimals: 18 }]);
    });
  });

  describe("fees", () => {
    it("should return fees meta response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getFeesMeta: () => Promise.resolve(mockFees)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.fees();

      // assert
      expect(res).toEqual([
        { chainKey: "mainnet", tokenSymbol: "JPYC", fixedFeeAmountUnits: 100n, fixedFeeAmountDisplay: 0.0001 }
      ]);
    });
  });

  describe("minTransfer", () => {
    it("should return min transfers meta response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getMinTransfersMeta: () => Promise.resolve(mockMinTransfers)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.minTransfer();

      // assert
      expect(res).toEqual([
        { chainKey: "mainnet", tokenSymbol: "JPYC", minTransferAmountUnits: 1000n, minTransferAmountDisplay: 0.001 }
      ]);
    });
  });

  describe("contracts", () => {
    it("should return contracts meta response", async () => {
      // arrange
      const meta = makeMockObject<MetaService>({
        getContractsMeta: () => Promise.resolve(mockContracts)
      });

      const metaController = new MetaController(meta);

      // act
      const res = await metaController.contracts();

      // assert
      expect(res).toEqual({
        delegate: { mainnet: getAddress(rawAddress) },
        registry: { mainnet: getAddress(rawAddress) },
        sponsor: { mainnet: getAddress(rawAddress) }
      });
    });
  });
});
