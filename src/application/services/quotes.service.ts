import { InternalServerErrorException } from "@nestjs/common";
import { add } from "date-fns";
import { Address, getContract, Hex } from "viem";

import { SUPPORT_CHAINS, SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import { QuoteModel } from "@/domain/entities/quote.entity";
import { FeeValueObject } from "@/domain/value-objects/fee-policy.value-object";
import { REGISTRY_ABI } from "@/infrastructure/evm/abis/registry.abi";
import { erc20TransferCall, hashExecutionIntent } from "@/infrastructure/evm/utils/evm-intent.util";
import { encodeQuoteToken } from "@/infrastructure/evm/utils/quote-token.util";
import { CreateQuoteRequestDto } from "@/interfaces/dto/quotes.dto";
import { BadRequestWithCodeException } from "@/interfaces/exceptions/bad-request-with-code.exception";
import {
  DELEGATE_CONTRACT_ADDRESS_REGISTORY,
  REGISTRY_CONTRACT_ADDRESS_REGISTORY
} from "@/registries/invoker.registry";
import { resolveTokenAddress, resolveTokenContract, TOKEN_REGISTRY } from "@/registries/token-chain.registry";
import { VIEM_PUBLIC_CLIENTS } from "@/registries/viem.registry";

export class QuotesService {
  constructor() {}

  async createQuote(dto: CreateQuoteRequestDto): Promise<QuoteModel> {
    const { chain, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const now = new Date();
    const expiresAt = add(now, { minutes: 2 });
    const expiresAtSec = BigInt(Math.floor(expiresAt.getTime() / 1000));

    // Calculate Fee
    const feeValueObject = FeeValueObject.create(chain, feeToken.symbol);
    const { fee, policy } = feeValueObject.apply();

    // Sender balance checks for token and feeToken
    try {
      const erc20Contract = resolveTokenContract(token.symbol, chain);
      const balToken = await erc20Contract.read.balanceOf([sender]);

      if (token.symbol === feeToken.symbol) {
        const required = amountMinUnits + fee.minUnits;
        if (balToken < required)
          throw new BadRequestWithCodeException(
            "InsufficientCombinedBalance",
            `Insufficient ${token.symbol} balance: required ${required} minimal units (amount ${amountMinUnits} + fee ${fee.minUnits}), but sender has ${balToken}.`
          );
      } else {
        const erc20ContractWithFee = resolveTokenContract(feeToken.symbol, chain);
        const balFeeToken = await erc20ContractWithFee.read.balanceOf([sender]);

        if (balToken < amountMinUnits)
          throw new BadRequestWithCodeException(
            "InsufficientSendBalance",
            `Insufficient ${token.symbol} balance: required ${amountMinUnits} minimal units, but sender has ${balToken}.`
          );
        if (balFeeToken < fee.minUnits)
          throw new BadRequestWithCodeException(
            "InsufficientFeeBalance",
            `Insufficient ${feeToken.symbol} balance for fee: required ${fee.minUnits} minimal units, but sender has ${balFeeToken}.`
          );
      }
    } catch (e) {
      if (e instanceof BadRequestWithCodeException) throw e;
      throw new BadRequestWithCodeException(
        "TokenBalanceFetchFailed",
        "Failed to retrieve token balance for the specified token.",
        { cause: e }
      );
    }

    try {
      const nonce = await this.getNextNonce(chain, sender);
      const callHash = this.buildCallHash(dto, nonce, fee.minUnits, expiresAtSec);
      const quoteToken = this.buildQuoteToken(dto, nonce, callHash, fee.minUnits, expiresAtSec);

      return {
        quoteToken,
        expiresAt,
        chainId: SUPPORT_CHAINS[chain].id,
        sender,
        recipient,
        token: {
          symbol: token.symbol,
          address: resolveTokenAddress(token.symbol, chain),
          decimals: TOKEN_REGISTRY[token.symbol].decimals
        },
        feeToken: {
          symbol: feeToken.symbol,
          address: resolveTokenAddress(feeToken.symbol, chain),
          decimals: TOKEN_REGISTRY[feeToken.symbol].decimals
        },
        amount: {
          symbol: token.symbol,
          minUnits: amountMinUnits,
          decimals: TOKEN_REGISTRY[token.symbol].decimals
        },
        fee,
        delegate: DELEGATE_CONTRACT_ADDRESS_REGISTORY[chain],
        sponsor: ENV.SPONSOR_ADDRESS,
        callHash,
        policy,
        serverTime: new Date()
      };
    } catch (e) {
      throw new InternalServerErrorException("Failed to create the quote.", { cause: e });
    }
  }

  /** ===== Private Functions ===== */
  private async getNextNonce(chain: SupportChain, sender: Address): Promise<bigint> {
    const registryContract = getContract({
      abi: REGISTRY_ABI,
      address: REGISTRY_CONTRACT_ADDRESS_REGISTORY[chain],
      client: VIEM_PUBLIC_CLIENTS[chain]
    });

    const nonce = await registryContract.read.nextNonce([sender]);
    return nonce;
  }

  private buildCallHash(dto: CreateQuoteRequestDto, nonce: bigint, feeMinUnits: bigint, expiresAtSec: bigint): Hex {
    const { chain, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const transferAmountCallData = erc20TransferCall({
      token: resolveTokenAddress(token.symbol, chain),
      to: recipient,
      amountMinUnits
    });

    const transferFeeCallData = erc20TransferCall({
      token: resolveTokenAddress(feeToken.symbol, chain),
      to: ENV.SPONSOR_ADDRESS,
      amountMinUnits: feeMinUnits
    });

    const callHash = hashExecutionIntent({
      chainId: SUPPORT_CHAINS[chain].id,
      sender,
      calls: [transferAmountCallData, transferFeeCallData],
      nonce,
      expiresAtSec
    });
    return callHash;
  }

  private buildQuoteToken(
    dto: CreateQuoteRequestDto,
    nonce: bigint,
    callHash: Hex,
    feeMinUnits: bigint,
    expiresAtSec: bigint
  ): string {
    const { chain, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const quoteToken = encodeQuoteToken(
      {
        v: 1,
        chainId: SUPPORT_CHAINS[chain].id,
        sender,
        recipient,
        token: resolveTokenAddress(token.symbol, chain),
        feeToken: resolveTokenAddress(feeToken.symbol, chain),
        amountMinUnits,
        feeMinUnits: feeMinUnits,
        delegate: DELEGATE_CONTRACT_ADDRESS_REGISTORY[chain],
        sponsor: ENV.SPONSOR_ADDRESS,
        expiresAt: expiresAtSec,
        callHash,
        nonce
      },
      ENV.QUOTE_TOKEN_SECRET
    );

    return quoteToken;
  }
}
