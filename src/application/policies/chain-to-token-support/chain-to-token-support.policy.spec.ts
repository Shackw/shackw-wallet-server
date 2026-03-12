import { describe, it, expect } from "vitest";

import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import { ApplicationError } from "@/application/errors";
import type {
  FindTokenDeploymentQuery,
  TokenDeploymentContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

import { ChainToTokenSupportPolicy } from "./chain-to-token-support.policy";

import type { ChainToTokenSupportInput } from "./chain-to-token-support.policy.types";

describe("ChainToTokenSupportPolicy.execute", () => {
  it("should throw UNSUPPORTED_TOKEN_FOR_CHAIN when token symbol is not supported on chain", () => {
    // arrange
    class TestTokenDepRepo extends StubTokenDeploymentRepository {
      findTokenDeployment(query: FindTokenDeploymentQuery): TokenDeploymentContract | null {
        expect(query).toEqual({ chainKey: "base", tokenSymbol: "JPYC" });
        return null;
      }
    }

    const testTokenDepRepo = new TestTokenDepRepo();
    const chainToTokenSupport = new ChainToTokenSupportPolicy(testTokenDepRepo);

    const input: ChainToTokenSupportInput = {
      chainKey: "base",
      tokenSymbol: "JPYC"
    };

    // act & assert
    expect(() => chainToTokenSupport.execute(input)).toThrowError(
      new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: "Token JPYC is not supported on chain base."
      })
    );
  });

  it("should succeed when token symbol is supported on chain", () => {
    // arrange
    class TestTokenDepRepo extends StubTokenDeploymentRepository {
      findTokenDeployment(_query: FindTokenDeploymentQuery): TokenDeploymentContract | null {
        return {
          token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 0 },
          chain: {
            id: 0,
            key: "mainnet",
            rpcUrl: "https://test-rpc.com/mainnet",
            viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet
          },
          contracts: {
            delegate: "0xDelegate",
            registry: "0xRegistry"
          },
          minTransferAmountUnits: 0n,
          fixedFeeAmountUnits: 0n
        };
      }
    }

    const testTokenDepRepo = new TestTokenDepRepo();
    const chainToTokenSupport = new ChainToTokenSupportPolicy(testTokenDepRepo);

    const input: ChainToTokenSupportInput = {
      chainKey: "mainnet",
      tokenSymbol: "JPYC"
    };

    // act
    const tokenDep = chainToTokenSupport.execute(input);

    // assert
    expect(tokenDep).toEqual({
      token: { address: "0xJpycAddress", symbol: "JPYC", currency: "JPY", decimals: 0 },
      chain: { id: 0, key: "mainnet", rpcUrl: "https://test-rpc.com/mainnet", viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet },
      contracts: {
        delegate: "0xDelegate",
        registry: "0xRegistry"
      },
      minTransferAmountUnits: 0n,
      fixedFeeAmountUnits: 0n
    });
  });
});
