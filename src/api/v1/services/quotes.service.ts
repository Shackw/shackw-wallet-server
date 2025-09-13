import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { add } from "date-fns";
import { Address, getContract, Hex } from "viem";

import { ENV } from "@/configs/env.config";
import { VIEM_PUBLIC_CLIENT } from "@/configs/viem.config";
import { REGISTRY_ABI } from "@/evm/abis/registry.abi";
import { erc20TransferCall, hashExecutionIntent } from "@/evm/utils/evm-intent.util";
import { encodeQuoteToken } from "@/evm/utils/quote-token.util";
import { toDecimals } from "@/helpers/token-units.helper";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { BadRequestWithCodeException } from "@/shared/exceptions/bad-request-with-code.exception";

import { CreateQuoteDto, QuoteDtoCommon } from "../dtos/quotes.dto";
import { QuoteModel } from "../models/quote.model";

import { FeesService } from "./fees.service";

@Injectable()
export class QuotesService {
  constructor(private readonly feesService: FeesService) {}

  async createQuote(dto: CreateQuoteDto): Promise<QuoteModel> {
    const { chainId, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const now = new Date();
    const expiresAt = add(now, { minutes: 2 });
    const expiresAtSec = BigInt(Math.floor(expiresAt.getTime() / 1000));

    const { feeMinUnits, policy } = await this.feesService.estimateFee({
      chainId,
      amountMinUnits,
      token,
      feeToken
    });

    // Sender balance checks for token and feeToken
    const erc20Contract = TOKEN_REGISTRY[token.symbol].contract;
    const balToken = await erc20Contract.read.balanceOf([sender]);

    if (token.symbol === feeToken.symbol) {
      const required = amountMinUnits + feeMinUnits;
      if (balToken < required)
        throw new BadRequestWithCodeException(
          "InsufficientCombinedBalance",
          `Insufficient ${token.symbol} balance: required ${required} minimal units (amount ${amountMinUnits} + fee ${feeMinUnits}), but sender has ${balToken}.`
        );
    } else {
      const erc20ContractWithFee = TOKEN_REGISTRY[feeToken.symbol].contract;
      const balFeeToken = await erc20ContractWithFee.read.balanceOf([sender]);

      if (balToken < amountMinUnits)
        throw new BadRequestWithCodeException(
          "InsufficientSendBalance",
          `Insufficient ${token.symbol} balance: required ${amountMinUnits} minimal units, but sender has ${balToken}.`
        );
      if (balFeeToken < feeMinUnits)
        throw new BadRequestWithCodeException(
          "InsufficientFeeBalance",
          `Insufficient ${feeToken.symbol} balance for fee: required ${feeMinUnits} minimal units, but sender has ${balFeeToken}.`
        );
    }

    try {
      const nonce = await this.getNextNonce(sender);
      const callHash = this.buildCallHash(dto, nonce, feeMinUnits, expiresAtSec);
      const quoteToken = this.buildQuoteToken(dto, nonce, callHash, feeMinUnits, expiresAtSec);

      return {
        quoteToken,
        expiresAt,
        chainId,
        sender,
        recipient,
        token: {
          symbol: token.symbol,
          address: TOKEN_REGISTRY[token.symbol].address,
          decimals: TOKEN_REGISTRY[token.symbol].decimals
        },
        feeToken: {
          symbol: feeToken.symbol,
          address: TOKEN_REGISTRY[feeToken.symbol].address,
          decimals: TOKEN_REGISTRY[feeToken.symbol].decimals
        },
        amount: {
          minUnits: amountMinUnits,
          decimals: toDecimals(amountMinUnits, token.symbol)
        },
        fee: {
          minUnits: feeMinUnits,
          decimals: toDecimals(feeMinUnits, feeToken.symbol)
        },
        delegate: ENV.DELEGATE_ADDRESS,
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
  private async getNextNonce(sender: Address): Promise<bigint> {
    const registryContract = getContract({
      abi: REGISTRY_ABI,
      address: ENV.REGISTRY_ADDRESS,
      client: VIEM_PUBLIC_CLIENT
    });

    const nonce = await registryContract.read.nextNonce([sender]);
    return nonce;
  }

  private buildCallHash(dto: QuoteDtoCommon, nonce: bigint, feeMinUnits: bigint, expiresAtSec: bigint): Hex {
    const { chainId, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const transferAmountCallData = erc20TransferCall({
      token: TOKEN_REGISTRY[token.symbol].address,
      to: recipient,
      amountMinUnits
    });

    const transferFeeCallData = erc20TransferCall({
      token: TOKEN_REGISTRY[feeToken.symbol].address,
      to: ENV.SPONSOR_ADDRESS,
      amountMinUnits: feeMinUnits
    });

    const callHash = hashExecutionIntent({
      chainId,
      sender,
      calls: [transferAmountCallData, transferFeeCallData],
      nonce,
      expiresAtSec
    });
    return callHash;
  }

  private buildQuoteToken(
    dto: QuoteDtoCommon,
    nonce: bigint,
    callHash: Hex,
    feeMinUnits: bigint,
    expiresAtSec: bigint
  ): string {
    const { chainId, sender, recipient, token, feeToken, amountMinUnits } = dto;

    const quoteToken = encodeQuoteToken(
      {
        v: 1,
        chainId,
        sender,
        recipient,
        token: TOKEN_REGISTRY[token.symbol].address,
        feeToken: TOKEN_REGISTRY[feeToken.symbol].address,
        amountMinUnits,
        feeMinUnits: feeMinUnits,
        delegate: ENV.DELEGATE_ADDRESS,
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
