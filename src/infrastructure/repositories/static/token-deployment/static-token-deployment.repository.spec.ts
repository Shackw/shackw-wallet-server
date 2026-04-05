import { describe, it, expect } from "vitest";

import type {
  FindTokenDeploymentQuery,
  FindTokenMasterByAddressQuery
} from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/domain/constants/chain.constant";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";
import type { ChainMaster, ChainMasterEntry } from "@/infrastructure/masters/chain.master";
import type {
  TokenDeploymentMaster,
  TokenDeploymentMasterEntry
} from "@/infrastructure/masters/token-deployment.master";

import { StaticTokenDeploymentRepository } from "./static-token-deployment.repository";

describe("StaticTokenDeploymentRepository", () => {
  describe("findTokenMasterByAddress", () => {
    it("should return null if master entry is empty", async () => {
      // arrange
      const inputTokenAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({});
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: inputTokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toBeNull();
    });

    it("should return null if token address mismatches", async () => {
      // arrange
      const inputTokenAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
      const entryTokenAddr = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      const mainnetJpycEntry: TokenDeploymentMasterEntry = {
        chainKey: "mainnet",
        tokenSymbol: "JPYC",
        tokenAddress: entryTokenAddr,
        fixedFeeAmountUnits: 100n,
        minTransferAmountUnits: 1000n
      } as const;

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({
            "JPYC:mainnet": mainnetJpycEntry
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: inputTokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toBeNull();
    });

    it("should return token masters if entry found", async () => {
      // arrange
      const tokenAddr = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      const mainnetJpycEntry: TokenDeploymentMasterEntry = {
        chainKey: "mainnet",
        tokenSymbol: "JPYC",
        tokenAddress: tokenAddr,
        fixedFeeAmountUnits: 100n,
        minTransferAmountUnits: 1000n
      } as const;

      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({
            "JPYC:mainnet": mainnetJpycEntry
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenMasterByAddressQuery = {
        address: tokenAddr,
        chainKey: "mainnet"
      };

      // act
      const result = await tokenDepRepository.findTokenMasterByAddress(query);

      // assert
      expect(result).toEqual({ currency: "JPY", decimals: 18, symbol: "JPYC" });
    });
  });

  describe("listChainMasters", () => {
    const mainnetEntry: ChainMasterEntry = {
      id: 1,
      rpcUrl: "https://test-rpc/mainnet",
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
    } as const;

    const baseEntry: ChainMasterEntry = {
      id: 8453,
      rpcUrl: "https://test-rpc/base",
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.base
    } as const;

    it("should return registered chain masters", async () => {
      // arrange
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      // act
      const results = await tokenDepRepository.listChainMasters();

      // assert
      expect(results).toMatchObject([
        { key: "mainnet", id: mainnetEntry.id, rpcUrl: mainnetEntry.rpcUrl, contracts: mainnetEntry.contracts },
        { key: "base", id: baseEntry.id, rpcUrl: baseEntry.rpcUrl, contracts: baseEntry.contracts }
      ]);
    });
  });

  describe("findChainMaster", () => {
    const mainnetEntry: ChainMasterEntry = {
      id: 1,
      rpcUrl: "https://test-rpc/mainnet",
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
    } as const;

    const baseEntry: ChainMasterEntry = {
      id: 8453,
      rpcUrl: "https://test-rpc/base",
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.base
    } as const;

    it("should return a chain master by chain key", async () => {
      // arrange
      const inputChainKey: Chain = "mainnet";
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      // act
      const results = await tokenDepRepository.findChainMaster({ chainKey: inputChainKey });

      // assert
      expect(results).toMatchObject({
        key: inputChainKey,
        id: mainnetEntry.id,
        rpcUrl: mainnetEntry.rpcUrl,
        contracts: mainnetEntry.contracts
      });
    });
  });

  describe("listTokenDeployment", () => {
    const mainnetEntry: ChainMasterEntry = {
      id: 1,
      rpcUrl: "https://test-rpc/mainnet",
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
    } as const;

    const baseEntry: ChainMasterEntry = {
      id: 8453,
      rpcUrl: "https://test-rpc/base",
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.base
    } as const;

    const mainJpycEntry: TokenDeploymentMasterEntry = {
      chainKey: "mainnet",
      tokenSymbol: "JPYC",
      tokenAddress: "0xMainnetJpyc",
      fixedFeeAmountUnits: 100n,
      minTransferAmountUnits: 1000n
    } as const;

    const baseUsdcEntry: TokenDeploymentMasterEntry = {
      chainKey: "base",
      tokenSymbol: "USDC",
      tokenAddress: "0xBaseUsdc",
      fixedFeeAmountUnits: 100n,
      minTransferAmountUnits: 1000n
    } as const;

    it("should return registered token deployments", async () => {
      // arrange
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }

        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({ "JPYC:mainnet": mainJpycEntry, "USDC:base": baseUsdcEntry });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      // act
      const results = await tokenDepRepository.listTokenDeployment();

      // assert
      expect(results).toMatchObject([
        {
          chain: {
            id: 1,
            key: "mainnet",
            rpcUrl: "https://test-rpc/mainnet"
          },
          contracts: {
            delegate: "0xMainnetDelegate",
            registry: "0xMainnetRegistry",
            sponsor: "0xMainnetSponsor"
          },
          fixedFeeAmountUnits: 100n,
          minTransferAmountUnits: 1000n,
          token: {
            address: "0xMainnetJpyc",
            currency: "JPY",
            decimals: 18,
            symbol: "JPYC"
          }
        },
        {
          chain: {
            id: 8453,
            key: "base",
            rpcUrl: "https://test-rpc/base"
          },
          contracts: {
            delegate: "0xBaseDelegate",
            registry: "0xBaseRegistry",
            sponsor: "0xBaseSponsor"
          },
          fixedFeeAmountUnits: 100n,
          minTransferAmountUnits: 1000n,
          token: {
            address: "0xBaseUsdc",
            currency: "USD",
            decimals: 6,
            symbol: "USDC"
          }
        }
      ]);
    });
  });

  describe("findTokenDeployment", () => {
    const mainnetEntry: ChainMasterEntry = {
      id: 1,
      rpcUrl: "https://test-rpc/mainnet",
      contracts: {
        sponsor: "0xMainnetSponsor",
        delegate: "0xMainnetDelegate",
        registry: "0xMainnetRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
    } as const;

    const baseEntry: ChainMasterEntry = {
      id: 8453,
      rpcUrl: "https://test-rpc/base",
      contracts: {
        sponsor: "0xBaseSponsor",
        delegate: "0xBaseDelegate",
        registry: "0xBaseRegistry"
      },
      viem: CHAIN_KEY_TO_VIEM_CHAIN.base
    } as const;

    const mainJpycEntry: TokenDeploymentMasterEntry = {
      chainKey: "mainnet",
      tokenSymbol: "JPYC",
      tokenAddress: "0xMainnetJpyc",
      fixedFeeAmountUnits: 100n,
      minTransferAmountUnits: 1000n
    } as const;

    const baseUsdcEntry: TokenDeploymentMasterEntry = {
      chainKey: "base",
      tokenSymbol: "USDC",
      tokenAddress: "0xBaseUsdc",
      fixedFeeAmountUnits: 100n,
      minTransferAmountUnits: 1000n
    } as const;

    it("should return null when if token symbol mismatches", async () => {
      // arrange
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }

        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({ "JPYC:mainnet": mainJpycEntry, "USDC:base": baseUsdcEntry });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenDeploymentQuery = {
        chainKey: "mainnet",
        tokenSymbol: "EURC"
      };

      // act
      const results = await tokenDepRepository.findTokenDeployment(query);

      // assert
      expect(results).toBeNull();
    });

    it("should return null when if chain key mismatches", async () => {
      // arrange
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }

        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({ "JPYC:mainnet": mainJpycEntry, "USDC:base": baseUsdcEntry });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenDeploymentQuery = {
        chainKey: "base",
        tokenSymbol: "JPYC"
      };

      // act
      const results = await tokenDepRepository.findTokenDeployment(query);

      // assert
      expect(results).toBeNull();
    });

    it("should return a token deployment when token symbol and chain key match", async () => {
      // arrange
      class TestTokenDeploymentRepository extends StaticTokenDeploymentRepository {
        protected override async _getChainMaster(): Promise<ChainMaster> {
          return Promise.resolve({
            mainnet: mainnetEntry,
            base: baseEntry
          } as unknown as ChainMaster);
        }

        protected override async _getTokenDeploymentMaster(): Promise<TokenDeploymentMaster> {
          return Promise.resolve({ "JPYC:mainnet": mainJpycEntry, "USDC:base": baseUsdcEntry });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();

      const query: FindTokenDeploymentQuery = {
        chainKey: "base",
        tokenSymbol: "USDC"
      };

      // act
      const results = await tokenDepRepository.findTokenDeployment(query);

      // assert
      expect(results).toMatchObject({
        chain: {
          id: 8453,
          key: "base",
          rpcUrl: "https://test-rpc/base"
        },
        contracts: {
          delegate: "0xBaseDelegate",
          registry: "0xBaseRegistry",
          sponsor: "0xBaseSponsor"
        },
        fixedFeeAmountUnits: 100n,
        minTransferAmountUnits: 1000n,
        token: {
          address: "0xBaseUsdc",
          currency: "USD",
          decimals: 6,
          symbol: "USDC"
        }
      });
    });
  });
});
