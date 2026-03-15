import { describe, it, expect } from "vitest";

import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import type {
  ChainMasterContract,
  TokenDeploymentContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { MetaService } from "./meta.service";

describe("MetaService", () => {
  const chainMasterContracts: ChainMasterContract[] = [
    {
      key: "mainnet",
      id: CHAIN_KEY_TO_VIEM_CHAIN.mainnet.id,
      rpcUrl: "https://test-rpc.com/mainnet",
      viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet,
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      }
    },
    {
      key: "base",
      id: CHAIN_KEY_TO_VIEM_CHAIN.base.id,
      rpcUrl: "https://test-rpc.com/base",
      viem: { ...CHAIN_KEY_TO_VIEM_CHAIN.base, testnet: undefined },
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      }
    },
    {
      key: "polygonAmoy",
      id: CHAIN_KEY_TO_VIEM_CHAIN.polygonAmoy.id,
      rpcUrl: "https://test-rpc.com/polygonAmoy",
      viem: CHAIN_KEY_TO_VIEM_CHAIN.polygonAmoy,
      contracts: {
        sponsor: "0xPolygonAmoySponsor",
        delegate: "0xPolygonAmoyDelegate",
        registry: "0xPolygonAmoyRegistry"
      }
    }
  ];

  const tokenDeploymentContracts: TokenDeploymentContract[] = [
    {
      token: { symbol: "USDC", address: "0xBaseUsdcAddress", currency: "USD", decimals: 6 },
      chain: {
        key: "base",
        id: CHAIN_KEY_TO_VIEM_CHAIN.base.id,
        rpcUrl: "https://test-rpc.com/base",
        viem: CHAIN_KEY_TO_VIEM_CHAIN.base
      },
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      },
      minTransferAmountUnits: 3000000n,
      fixedFeeAmountUnits: 50000n
    },
    {
      token: { symbol: "JPYC", address: "0xMainnetJpycAddress", currency: "JPY", decimals: 18 },
      chain: {
        key: "mainnet",
        id: CHAIN_KEY_TO_VIEM_CHAIN.mainnet.id,
        rpcUrl: "https://test-rpc.com/mainnet",
        viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
      },
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      },
      minTransferAmountUnits: 1000000000000000000000n,
      fixedFeeAmountUnits: 100000000000000000000n
    },
    {
      token: { symbol: "JPYC", address: "0xPolygonJpycAddress", currency: "JPY", decimals: 18 },
      chain: {
        key: "polygon",
        id: CHAIN_KEY_TO_VIEM_CHAIN.polygon.id,
        rpcUrl: "https://test-rpc.com/polygon",
        viem: CHAIN_KEY_TO_VIEM_CHAIN.polygon
      },
      contracts: {
        sponsor: "0xPolygonSponsor",
        delegate: "0xPolygonDelegate",
        registry: "0xPolygonRegistry"
      },
      minTransferAmountUnits: 100000000000000000000n,
      fixedFeeAmountUnits: 2000000000000000000n
    }
  ];

  describe("getChainsMeta", () => {
    it("should return chain metadata for all supported chains", () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        listChainMasters(): ChainMasterContract[] {
          return chainMasterContracts;
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const chainsMeta = meta.getChainsMeta();

      // assert
      expect(chainsMeta).toEqual([
        { id: 1, key: "mainnet", testnet: false },
        { id: 8453, key: "base", testnet: false },
        { id: 80002, key: "polygonAmoy", testnet: true }
      ]);
    });
  });

  describe("getTokensMeta", () => {
    it("should return token metadata for all supported tokens on every chain", () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        listTokenDeployment(): TokenDeploymentContract[] {
          return tokenDeploymentContracts;
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const tokensMeta = meta.getTokensMeta();

      // assert
      expect(tokensMeta).toEqual([
        { symbol: "USDC", decimals: 6, address: { base: "0xBaseUsdcAddress" } },
        {
          symbol: "JPYC",
          decimals: 18,
          address: { mainnet: "0xMainnetJpycAddress", polygon: "0xPolygonJpycAddress" }
        }
      ]);
    });
  });

  describe("getFeesMeta", () => {
    it("should return fee metadata for all supported tokens across all chains", () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        listTokenDeployment(): TokenDeploymentContract[] {
          return tokenDeploymentContracts;
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const feesMeta = meta.getFeesMeta();

      // assert
      expect(feesMeta).toEqual([
        {
          chainKey: "base",
          tokenSymbol: "USDC",
          fixedFeeAmountUnits: 50000n,
          fixedFeeAmountDisplay: 0.05
        },
        {
          chainKey: "mainnet",
          tokenSymbol: "JPYC",
          fixedFeeAmountUnits: 100000000000000000000n,
          fixedFeeAmountDisplay: 100
        },
        {
          chainKey: "polygon",
          tokenSymbol: "JPYC",
          fixedFeeAmountUnits: 2000000000000000000n,
          fixedFeeAmountDisplay: 2
        }
      ]);
    });
  });

  describe("getMinTransfersMeta", () => {
    it("should return min transfers units metadata for all supported tokens across all chains", () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        listTokenDeployment(): TokenDeploymentContract[] {
          return tokenDeploymentContracts;
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const minTransfersMeta = meta.getMinTransfersMeta();

      // assert
      expect(minTransfersMeta).toEqual([
        {
          chainKey: "base",
          tokenSymbol: "USDC",
          minTransferAmountUnits: 3000000n,
          minTransferAmountDisplay: 3
        },
        {
          chainKey: "mainnet",
          tokenSymbol: "JPYC",
          minTransferAmountUnits: 1000000000000000000000n,
          minTransferAmountDisplay: 1000
        },
        {
          chainKey: "polygon",
          tokenSymbol: "JPYC",
          minTransferAmountUnits: 100000000000000000000n,
          minTransferAmountDisplay: 100
        }
      ]);
    });
  });

  describe("getContractsMeta", () => {
    it("should return contracts addresses metadata for all supported chains", () => {
      // arrange
      class TestTokenDepRepository extends StubTokenDeploymentRepository {
        listChainMasters(): ChainMasterContract[] {
          return chainMasterContracts;
        }
      }

      const tokenDepRepository = new TestTokenDepRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const contractsMeta = meta.getContractsMeta();

      // assert
      expect(contractsMeta).toEqual({
        sponsor: {
          mainnet: "0xMainnetSponsor",
          base: "0xBaseSponsor",
          polygonAmoy: "0xPolygonAmoySponsor"
        },
        delegate: {
          mainnet: "0xMainnetDelegate",
          base: "0xBaseDelegate",
          polygonAmoy: "0xPolygonAmoyDelegate"
        },
        registry: {
          mainnet: "0xMainnetRegistry",
          base: "0xBaseRegistry",
          polygonAmoy: "0xPolygonAmoyRegistry"
        }
      });
    });
  });

  describe("getMetaSummary", () => {
    it("should return metadata summary for all supported chains", () => {
      // arrange
      const tokenDepRepository = new StubTokenDeploymentRepository();
      const meta = new MetaService(tokenDepRepository);

      // act
      const summary = meta.getMetaSummary();

      // assert
      expect(summary).toEqual({
        schemaVersion: "v1",
        chains: [],
        tokens: [],
        fixedFees: [],
        minTransfers: [],
        contracts: { sponsor: {}, delegate: {}, registry: {} }
      });
    });
  });
});
