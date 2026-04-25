import { Inject, Injectable } from "@nestjs/common";
import { verifyAuthorization } from "viem/utils";

import { ApplicationError } from "@/application/errors";
import type { BalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import type { RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";
import type { SponsorAdapter } from "@/application/ports/adapters/sponsor.adapter.port";
import type { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import { buildExcutionIntent } from "@/application/protocols/execution-intent";
import { decodeQuoteToken } from "@/application/protocols/quote-token";
import type { TransferTokenEntity } from "@/domain/entities/token.entity";
import { DI_TOKENS } from "@/shared/di.tokens";

import type { TransferTokenInput } from "./tokens.service.types";
import type { Hex } from "viem";

@Injectable()
export class TokensService {
  constructor(
    @Inject(DI_TOKENS.QUOTE_TOKEN_SECRET)
    private readonly quoteTokenSecret: Hex,

    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDepRepository: TokenDeploymentRepository,

    @Inject(DI_TOKENS.REGISTRY_ADAPTER)
    private readonly registryAdapter: RegistryAdapter,

    @Inject(DI_TOKENS.SPONSOR_ADAPTER)
    private readonly sponsorAdapter: SponsorAdapter,

    @Inject(DI_TOKENS.BALANCE_SUFFICIENCY_POLICY)
    private readonly balanceSufficiency: BalanceSufficiencyPolicy
  ) {}

  async transferToken(input: TransferTokenInput): Promise<TransferTokenEntity> {
    const { chainKey, quoteToken, authorization } = input;

    // 1) Verify & decode quoteToken (HMAC integrity)
    const {
      chainId,
      sender,
      recipient,
      token,
      feeToken,
      amountMinUnits,
      feeMinUnits,
      delegate,
      sponsor,
      expiresAt,
      nonce,
      callHash
    } = decodeQuoteToken(quoteToken, this.quoteTokenSecret);

    // 2a) Check quote token expiration (with 15s grace)
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    if (nowSec > expiresAt + 15n)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_EXPIRED",
        message: "Quote token has expired."
      });

    // 2b) Validate that the chain in the payload matches the chain used when issuing the quote.
    const chainMaster = await this.tokenDepRepository.findChainMaster({ chainKey });
    if (chainMaster.id !== chainId)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_CHAIN_MISMATCH",
        message: "Chain in the payload does not match the chain used to issue the quote."
      });

    // 2c) Environment consistency
    if (delegate !== chainMaster.contracts.delegate)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_DELEGATE_MISMATCH",
        message: `Delegate mismatch: expected ${chainMaster.contracts.delegate}, got ${delegate}.`
      });

    if (sponsor !== chainMaster.contracts.sponsor)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_SPONSOR_MISMATCH",
        message: `Sponsor mismatch: expected ${chainMaster.contracts.sponsor}, got ${sponsor}.`
      });

    // 3) Rebuild calls and recompute callHash to ensure integrity
    const { calls, callHash: expectedCallHash } = buildExcutionIntent({
      chainId,
      sender,
      recipient,
      token,
      amountMinUnits,
      feeToken,
      sponsor,
      feeMinUnits,
      nonce,
      expiresAtSec: expiresAt
    });

    if (callHash !== expectedCallHash)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_CALL_HASH_MISMATCH",
        message: "Call hash mismatch: quoteToken payload does not match."
      });

    // 4) Replay protection: ensure nonce is fresh
    const expectedNonce = await this.registryAdapter
      .getNextNonce({ registry: chainMaster.contracts.registry, chainKey, owner: sender })
      .catch(e => {
        throw new ApplicationError({
          code: "FAILED_TO_FETCH_NEXT_NONCE",
          message: "Failed to fetch next nonce.",
          cause: e
        });
      });
    if (nonce !== expectedNonce)
      throw new ApplicationError({
        code: "QUOTE_TOKEN_NONCE_STALE",
        message: `Stale nonce: quoteToken.nonce=${nonce.toString()} does not match registry.nextNonce=${expectedNonce.toString()} for ${sender}.`
      });

    // 5) Verify EIP-7702 authorization for the sender EOA
    // 5a) Delegate must match quoteToken
    if (authorization.address !== delegate)
      throw new ApplicationError({
        code: "AUTHORIZATION_DELEGATE_MISMATCH",
        message: "Authorization delegate does not match quoteToken delegate.",
        httpStatus: 403
      });

    // 5b) Chain must match
    if (authorization.chainId !== chainId)
      throw new ApplicationError({
        code: "AUTHORIZATION_CHAIN_MISMATCH",
        message: "Authorization chainId mismatch.",
        httpStatus: 403
      });

    // 5c) Cryptographic validity (EOA signature)
    const validAuth = await verifyAuthorization({ address: sender, authorization });
    if (!validAuth)
      throw new ApplicationError({
        code: "AUTHORIZATION_INVALID",
        message: "Invalid EIP-7702 authorization.",
        httpStatus: 403
      });

    // 6) Sender balance checks for token and feeToken
    await this.balanceSufficiency.ensure({
      chainKey,
      owner: sender,
      tokenAddress: token,
      tokenRequiredMinUnits: amountMinUnits,
      feeTokenAddress: feeToken,
      feeRequiredMinUnits: feeMinUnits
    });

    // 7) Simulate and send execute() to the sender EOA (EIP-7702)
    const executeQuery = {
      sponsor: chainMaster.contracts.sponsor,
      chainKey,
      sender,
      calls,
      nonce: expectedNonce,
      expiresAt,
      callHash: expectedCallHash,
      authorization
    } as const;

    // 7a) Simulate with sponsor; throw 400 on failure.
    await this.sponsorAdapter.simulateDelegateExecute(executeQuery).catch(e => {
      throw new ApplicationError({ code: "SIMULATION_FAILED", message: "Simulation failed.", cause: e });
    });

    // 7b) Send transaction; obtain txHash.
    const txHash = await this.sponsorAdapter.writeDelegateExecute(executeQuery).catch(e => {
      throw new ApplicationError({ code: "TRANSACTION_SEND_FAILED", message: "Transaction send failed.", cause: e });
    });

    // 7c) Return immediately with submission info (confirmation handled by worker).
    return { status: "submitted", txHash };
  }
}
