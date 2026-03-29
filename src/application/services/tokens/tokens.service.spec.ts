import dayjs from "dayjs";
import { verifyAuthorization } from "viem/utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { StubRegistryAdapter } from "@test/doubles/adapters/stub-registry.adapter";
import { StubSponsorAdapter } from "@test/doubles/adapters/stub-sponsor.adapter";
import { StubBalanceSufficiencyPolicy } from "@test/doubles/policies/stub-balance-sufficiency.policy";
import { StubTokenDeploymentRepository } from "@test/doubles/repositories/stub-token-deployment.repository";

import { ApplicationError } from "@/application/errors";
import type { GetNextNonceQuery } from "@/application/ports/adapters/registry.adapter.port";
import type { DelegateExecuteQuery } from "@/application/ports/adapters/sponsor.adapter.port";
import type {
  FindChainMasterQuery,
  ChainMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import * as ExcutionIntentProtocol from "@/application/protocols/execution-intent";
import * as QuoteTokenProtocol from "@/application/protocols/quote-token";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";
import type { QuoteTokenValueObject } from "@/domain/value-objects/quote-token.value-object";

import { TokensService } from "./tokens.service";

import type { TransferTokenInput } from "./tokens.service.types";
import type { Authorization, Hex } from "viem";

vi.mock("viem/utils", { spy: true });

describe("TokensService", () => {
  const baseDecodeQuoteToken: QuoteTokenValueObject = {
    v: 0,
    chainId: 1,
    sender: "0xSender",
    recipient: "0xRecipient",
    token: "0xTokenAddress",
    feeToken: "0xFeeTokenAddress",
    amountMinUnits: 1_000_000n,
    feeMinUnits: 10_000n,
    delegate: "0xDelegate",
    sponsor: "0xSponsor",
    expiresAt: 1_800_000_000n,
    nonce: 100n,
    callHash: "0xCallHash"
  };

  const baseAuthorization: Authorization = {
    chainId: 1,
    address: "0xDelegate",
    nonce: 100,
    r: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    s: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    v: 27n
  };

  const baseExecutionIntentOutput: ExcutionIntentProtocol.BuildExecutionIntentOutput = {
    calls: [
      { to: "0xCall1", value: 0n, data: "0xData1" },
      { to: "0xCall2", value: 0n, data: "0xData2" }
    ],
    callHash: "0xCallHash"
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("transferToken", () => {
    it("should throw QUOTE_TOKEN_EXPIRED when the received quote token is expired", async () => {
      // arrange
      const expiresAt = BigInt(dayjs("2025-12-20T00:00:00Z").unix());
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({ ...baseDecodeQuoteToken, expiresAt });

      const quoteTokenSecret = "0xQuoteTokenSecret";
      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        quoteTokenSecret,
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_EXPIRED",
          message: "Quote token has expired."
        })
      );

      expect(QuoteTokenProtocol.decodeQuoteToken).toHaveBeenCalledWith(input.quoteToken, quoteTokenSecret);
    });

    it("should throw QUOTE_TOKEN_CHAIN_MISMATCH when decoded token chain id does not match payload chain id", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({ ...baseDecodeQuoteToken, chainId: 2 });

      class TestTokenDeploymentRepository extends StubTokenDeploymentRepository {
        override findChainMaster(_query: FindChainMasterQuery): Promise<ChainMasterContract> {
          return Promise.resolve({
            key: "mainnet",
            id: 1,
            rpcUrl: "https://test-rpc.com/mainnet",
            viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet,
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            }
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_CHAIN_MISMATCH",
          message: "Chain in the payload does not match the chain used to issue the quote."
        })
      );
    });

    it("should throw QUOTE_TOKEN_DELEGATE_MISMATCH when decoded token delegate address does not match the delegate address for the input chain", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({
        ...baseDecodeQuoteToken,
        delegate: "0xDoesNotMatchDelegateAddress"
      });

      class TestTokenDeploymentRepository extends StubTokenDeploymentRepository {
        override findChainMaster(query: FindChainMasterQuery): Promise<ChainMasterContract> {
          expect(query).toEqual({ chainKey: "mainnet" });

          return Promise.resolve({
            key: "mainnet",
            id: 1,
            rpcUrl: "https://test-rpc.com/mainnet",
            viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet,
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            }
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_DELEGATE_MISMATCH",
          message: "Delegate mismatch: expected 0xDelegate, got 0xDoesNotMatchDelegateAddress."
        })
      );
    });

    it("should throw QUOTE_TOKEN_SPONSOR_MISMATCH when decoded token sponsor address does not match the sponsor address for the input chain", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({
        ...baseDecodeQuoteToken,
        sponsor: "0xDoesNotMatchSponsorAddress"
      });

      class TestTokenDeploymentRepository extends StubTokenDeploymentRepository {
        override findChainMaster(_query: FindChainMasterQuery): Promise<ChainMasterContract> {
          return Promise.resolve({
            key: "mainnet",
            id: 1,
            rpcUrl: "https://test-rpc.com/mainnet",
            viem: CHAIN_KEY_TO_VIEM_CHAIN.mainnet,
            contracts: {
              sponsor: "0xSponsor",
              delegate: "0xDelegate",
              registry: "0xRegistry"
            }
          });
        }
      }

      const tokenDepRepository = new TestTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_SPONSOR_MISMATCH",
          message: "Sponsor mismatch: expected 0xSponsor, got 0xDoesNotMatchSponsorAddress."
        })
      );
    });

    it("should throw QUOTE_TOKEN_CALL_HASH_MISMATCH when decoded token call hash does not match the recomputed call hash", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({
        ...baseDecodeQuoteToken,
        callHash: "0xDoesNotMatchCallHash"
      });
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue({
        ...baseExecutionIntentOutput,
        callHash: "0xRecomputedCallHash"
      });

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_CALL_HASH_MISMATCH",
          message: "Call hash mismatch: quoteToken payload does not match."
        })
      );

      expect(ExcutionIntentProtocol.buildExcutionIntent).toHaveBeenCalledWith({
        chainId: baseDecodeQuoteToken.chainId,
        sender: baseDecodeQuoteToken.sender,
        recipient: baseDecodeQuoteToken.recipient,
        token: baseDecodeQuoteToken.token,
        amountMinUnits: baseDecodeQuoteToken.amountMinUnits,
        feeToken: baseDecodeQuoteToken.feeToken,
        feeMinUnits: baseDecodeQuoteToken.feeMinUnits,
        sponsor: baseDecodeQuoteToken.sponsor,
        nonce: baseDecodeQuoteToken.nonce,
        expiresAtSec: baseDecodeQuoteToken.expiresAt
      });
    });

    it("should throw FAILED_TO_FETCH_NEXT_NONCE when fetching the next nonce fails", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue(baseDecodeQuoteToken);
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      class TestRegistryAdapter extends StubRegistryAdapter {
        override getNextNonce(query: GetNextNonceQuery): Promise<bigint> {
          expect(query).toEqual({ registry: "0xRegistry", chainKey: "mainnet", owner: baseDecodeQuoteToken.sender });

          return Promise.reject(new Error("on error when fetching next nonce"));
        }
      }

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new TestRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "FAILED_TO_FETCH_NEXT_NONCE",
          message: "Failed to fetch next nonce.",
          cause: new Error("on error when fetching next nonce")
        })
      );
    });

    it("should throw QUOTE_TOKEN_NONCE_STALE when decoded token nonce does not match fetched next nonce", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({ ...baseDecodeQuoteToken, nonce: 1n });
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      class TestRegistryAdapter extends StubRegistryAdapter {
        override getNextNonce(_query: GetNextNonceQuery): Promise<bigint> {
          return Promise.resolve(9999n);
        }
      }

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new TestRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "QUOTE_TOKEN_NONCE_STALE",
          message: "Stale nonce: quoteToken.nonce=1 does not match registry.nextNonce=9999 for 0xSender."
        })
      );
    });

    it("should throw AUTHORIZATION_DELEGATE_MISMATCH when decoded token delegate address does not match the authorization address in the payload", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({
        ...baseDecodeQuoteToken,
        delegate: "0xDelegate"
      });
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: { ...baseAuthorization, address: "0xDoesNotMatchDelegateAddress" }
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "AUTHORIZATION_DELEGATE_MISMATCH",
          message: "Authorization delegate does not match quoteToken delegate.",
          httpStatus: 403
        })
      );
    });

    it("should throw AUTHORIZATION_CHAIN_MISMATCH when decoded token chain id does not match the authorization chain id in the payload", async () => {
      // arrange
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue({
        ...baseDecodeQuoteToken,
        chainId: 1
      });
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: { ...baseAuthorization, chainId: 999 }
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "AUTHORIZATION_CHAIN_MISMATCH",
          message: "Authorization chainId mismatch.",
          httpStatus: 403
        })
      );
    });

    it("should throw AUTHORIZATION_INVALID when authorization is invalid", async () => {
      // arrange
      vi.mocked(verifyAuthorization).mockResolvedValue(false);
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue(baseDecodeQuoteToken);
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new StubSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "AUTHORIZATION_INVALID",
          message: "Invalid EIP-7702 authorization.",
          httpStatus: 403
        })
      );

      expect(verifyAuthorization).toHaveBeenCalledWith({
        address: "0xSender",
        authorization: baseAuthorization
      });
    });

    it("should throw SIMULATION_FAILED when delegate execution simulation fails", async () => {
      // arrange
      vi.mocked(verifyAuthorization).mockResolvedValue(true);
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue(baseDecodeQuoteToken);
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      class TestSponsorAdapter extends StubSponsorAdapter {
        override simulateDelegateExecute(query: DelegateExecuteQuery): Promise<void> {
          expect(query).toEqual({
            sponsor: "0xSponsor",
            chainKey: "mainnet",
            sender: baseDecodeQuoteToken.sender,
            calls: baseExecutionIntentOutput.calls,
            nonce: baseDecodeQuoteToken.nonce,
            expiresAt: baseDecodeQuoteToken.expiresAt,
            callHash: baseDecodeQuoteToken.callHash,
            authorization: baseAuthorization
          });

          return Promise.reject(new Error("on error when simulation"));
        }
      }

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new TestSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "SIMULATION_FAILED",
          message: "Simulation failed.",
          cause: new Error("on error when simulation")
        })
      );
    });

    it("should throw TRANSACTION_SEND_FAILED when delegate execution write fails", async () => {
      // arrange
      vi.mocked(verifyAuthorization).mockResolvedValue(true);
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue(baseDecodeQuoteToken);
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      class TestSponsorAdapter extends StubSponsorAdapter {
        override writeDelegateExecute(query: DelegateExecuteQuery): Promise<Hex> {
          expect(query).toEqual({
            sponsor: "0xSponsor",
            chainKey: "mainnet",
            sender: baseDecodeQuoteToken.sender,
            calls: baseExecutionIntentOutput.calls,
            nonce: baseDecodeQuoteToken.nonce,
            expiresAt: baseDecodeQuoteToken.expiresAt,
            callHash: baseDecodeQuoteToken.callHash,
            authorization: baseAuthorization
          });

          return Promise.reject(new Error("on error when write"));
        }
      }

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new TestSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act & assert
      await expect(tokens.transferToken(input)).rejects.toThrow(
        new ApplicationError({
          code: "TRANSACTION_SEND_FAILED",
          message: "Transaction send failed.",
          cause: new Error("on error when write")
        })
      );
    });

    it("should return submitted status with tx hash when delegate execution write succeeds", async () => {
      // arrange
      vi.mocked(verifyAuthorization).mockResolvedValue(true);
      vi.spyOn(QuoteTokenProtocol, "decodeQuoteToken").mockReturnValue(baseDecodeQuoteToken);
      vi.spyOn(ExcutionIntentProtocol, "buildExcutionIntent").mockReturnValue(baseExecutionIntentOutput);

      class TestSponsorAdapter extends StubSponsorAdapter {
        override writeDelegateExecute(_query: DelegateExecuteQuery): Promise<Hex> {
          return Promise.resolve("0xTxHash");
        }
      }

      const tokenDepRepository = new StubTokenDeploymentRepository();
      const registryAdapter = new StubRegistryAdapter();
      const sponsorAdapter = new TestSponsorAdapter();
      const balanceSufficiency = new StubBalanceSufficiencyPolicy();
      const tokens = new TokensService(
        "0xQuoteTokenSecret",
        tokenDepRepository,
        registryAdapter,
        sponsorAdapter,
        balanceSufficiency
      );

      const input: TransferTokenInput = {
        chainKey: "mainnet",
        quoteToken: "AAAA",
        authorization: baseAuthorization
      };

      // act
      const result = await tokens.transferToken(input);

      // assert
      expect(result).toEqual({ status: "submitted", txHash: "0xTxHash", notify: undefined });
    });
  });
});
