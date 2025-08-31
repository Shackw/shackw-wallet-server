import { randomBytes } from "crypto";

import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { add } from "date-fns";
import { Hex } from "viem";

import { ENV } from "@/configs/env.config";
import { erc20TransferCall, hashExecutionIntent } from "@/evm/utils/evm-intent.util";
import { encodeQuoteToken } from "@/evm/utils/quote-token.util";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDecimals } from "@/utils/token-units.util";

import { CreateQuoteDto } from "../dtos/quotes.dto";
import { QuoteModel } from "../models/quote.model";

import { FeesService } from "./fees.service";

@Injectable()
export class QuotesService {
  constructor(private readonly feesService: FeesService) {}

  async createQuote(input: CreateQuoteDto): Promise<QuoteModel> {
    const { chainId, sender, recipient, token, feeToken, amountMinUnits } = input;

    const now = new Date();
    const expiresAt = add(now, { minutes: 2 });
    const expiresAtSec = BigInt(Math.floor(expiresAt.getTime() / 1000));

    const nonce32 = ("0x" + randomBytes(32).toString("hex")) as Hex;

    const { feeMinUnits, policy } = await this.feesService.estimateFee({
      chainId,
      amountMinUnits,
      token,
      feeToken
    });

    try {
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
        delegate: ENV.DELEGATE_ADDRESS,
        sponsor: ENV.SPONSOR_ADDRESS,
        calls: [transferAmountCallData, transferFeeCallData],
        expiresAtSec,
        nonce32
      });

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
          nonce32
        },
        ENV.QUOTE_TOKEN_SECRET
      );

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
    } catch (error) {
      Logger.log("QuotesService.createQuote", error);
      throw new InternalServerErrorException("Failed to create the quote.");
    }
  }
}
