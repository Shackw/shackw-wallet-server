import { Inject } from "@nestjs/common";
import dayjs from "dayjs";
import { Hex } from "viem";

import { ApplicationError } from "@/application/errors";
import { BalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import { RegistryAdapter } from "@/application/ports/adapters/registry.adapter.port";
import { buildExcutionIntent } from "@/application/protocols/execution-intent";
import { encodeQuoteToken } from "@/application/protocols/quote-token";
import type { QuoteEntity } from "@/domain/entities/quote.entity";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { CreateQuoteInput } from "./quotes.service.types";

export class QuotesService {
  constructor(
    @Inject(DI_TOKENS.QUOTE_TOKEN_SECRET)
    private readonly quoteTokenSecret: Hex,

    @Inject(DI_TOKENS.REGISTRY_ADAPTER)
    private readonly registryAdapter: RegistryAdapter,

    private readonly eligibilityPolicy: TransferEligibilityPolicy,

    private readonly balanceSufficiencyPolicy: BalanceSufficiencyPolicy
  ) {}

  async createQuote(input: CreateQuoteInput): Promise<QuoteEntity> {
    const { chainKey, sender, recipient, tokenSymbol, feeTokenSymbol, amountMinUnits } = input;

    const now = dayjs();
    const expiresAt = now.add(2, "minute").toDate();
    const expiresAtSec = BigInt(Math.floor(expiresAt.getTime() / 1000));

    // Eligibility transfer (support + min amount + fee policy)
    const { chain, tokenDep, feeTokenDep, contracts, feePolicy } = this.eligibilityPolicy.execute({
      chainKey,
      tokenSymbol,
      feeTokenSymbol,
      amountMinUnits
    });

    // Sender balance checks for token and feeToken
    await this.balanceSufficiencyPolicy.ensure({
      chainKey,
      owner: sender,
      tokenAddress: tokenDep.token.address,
      tokenRequiredMinUnits: amountMinUnits,
      feeTokenAddress: feeTokenDep.token.address,
      feeRequiredMinUnits: feeTokenDep.fixedFeeAmountUnits
    });

    const nonce = await this.registryAdapter.getNextNonce({ chainKey: chain.key, owner: sender }).catch(e => {
      throw new ApplicationError({
        code: "FAILED_TO_FETCH_NEXT_NONCE",
        message: "Failed to fetch next nonce.",
        httpStatus: 500,
        cause: e
      });
    });

    // Build calls and compute callHash to ensure integrity
    const { callHash } = buildExcutionIntent({
      chainId: chain.id,
      sender,
      recipient,
      token: tokenDep.token.address,
      amountMinUnits,
      feeToken: feeTokenDep.token.address,
      sponsor: contracts.sponsor,
      feeMinUnits: feeTokenDep.fixedFeeAmountUnits,
      nonce,
      expiresAtSec
    });

    const quoteToken = encodeQuoteToken(
      {
        v: 1,
        chainId: chain.id,
        sender,
        recipient,
        token: tokenDep.token.address,
        feeToken: feeTokenDep.token.address,
        amountMinUnits,
        feeMinUnits: feeTokenDep.fixedFeeAmountUnits,
        delegate: contracts.delegate,
        sponsor: contracts.sponsor,
        expiresAt: expiresAtSec,
        callHash,
        nonce
      },
      this.quoteTokenSecret
    );

    return {
      nonce,
      quoteToken,
      expiresAt,
      serverTime: now.toDate(),
      chainId: chain.id,
      delegate: contracts.delegate,
      sponsor: contracts.sponsor,
      sender,
      recipient,
      token: {
        symbol: tokenDep.token.symbol,
        address: tokenDep.token.address,
        decimals: tokenDep.token.decimals
      },
      feeToken: {
        symbol: feeTokenDep.token.symbol,
        address: feeTokenDep.token.address,
        decimals: feeTokenDep.token.decimals
      },
      amount: {
        symbol: tokenDep.token.symbol,
        minUnits: amountMinUnits,
        decimals: tokenDep.token.decimals
      },
      fee: {
        symbol: feeTokenDep.token.symbol,
        minUnits: feeTokenDep.fixedFeeAmountUnits,
        decimals: feeTokenDep.token.decimals
      },
      policy: feePolicy,
      callHash
    };
  }
}
