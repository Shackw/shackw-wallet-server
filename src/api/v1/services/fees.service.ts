import { Inject, Injectable } from "@nestjs/common";

import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { calcFeeByBps } from "@/utils/fee.util";
import { toDisimals } from "@/utils/token-units.util";

import { EstimateFeeDto } from "../dtos/fees.dto";
import { FeeModel } from "../models/fee.model";
import { EXCHANGE_GATEWAY } from "../providers/repositories.provider";
import { FetchExchangePayload, IExchangeGateway } from "../repositories/exchanges/exchanges.gateway.interface";

@Injectable()
export class FeesService {
  constructor(
    @Inject(EXCHANGE_GATEWAY)
    private readonly exchangeGateway: IExchangeGateway
  ) {}
  async estimateFee(input: EstimateFeeDto): Promise<FeeModel> {
    const { amountMinUnits, token, feeToken } = input;

    const bps = FEE_REGISTORY[token.symbol].bps;
    const maxFee = FEE_REGISTORY[feeToken.symbol].cap;

    const payload: FetchExchangePayload = {
      base: TOKEN_REGISTRY[token.symbol].currency,
      symbol: TOKEN_REGISTRY[feeToken.symbol].currency
    };
    const rate = await this.exchangeGateway.fetch(payload);

    const feeByBps = calcFeeByBps(amountMinUnits, bps) * BigInt(rate);

    const applyFee = maxFee > feeByBps ? feeByBps : maxFee;

    return {
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
      feeMinUnits: applyFee,
      feeDecimals: toDisimals(applyFee, feeToken.symbol),
      policy: {
        method: "bps_with_cap",
        version: "v1",
        bps,
        cap: {
          minUnit: maxFee,
          currency: feeToken.symbol
        }
      }
    };
  }
}
