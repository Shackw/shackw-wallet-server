import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";

import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDecimals, toMinUnits } from "@/utils/token-units.util";

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

  // TODO 為替取得時、キャッシュを適応する
  async estimateFee(input: EstimateFeeDto): Promise<FeeModel> {
    const { amountMinUnits, token, feeToken } = input;

    const bps = FEE_REGISTORY[token.symbol].bps;
    const maxFeeDecimals = FEE_REGISTORY[feeToken.symbol].capUnits;

    const rate = await (async () => {
      if (token.symbol !== feeToken.symbol) {
        const payload: FetchExchangePayload = {
          base: TOKEN_REGISTRY[token.symbol].currency,
          symbol: TOKEN_REGISTRY[feeToken.symbol].currency
        };
        return await this.exchangeGateway.fetch(payload);
      }
      return 1;
    })();

    try {
      const amountDecimals = toDecimals(amountMinUnits, token.symbol);
      const feeDecimalsByBps = amountDecimals * rate * (1 / bps);

      const feeDecimals = maxFeeDecimals > feeDecimalsByBps ? feeDecimalsByBps : maxFeeDecimals;

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
        feeMinUnits: toMinUnits(feeDecimals, feeToken.symbol),
        feeDecimals,
        policy: {
          method: "bps_with_cap",
          version: "v1",
          bps,
          cap: {
            minUnit: toMinUnits(maxFeeDecimals, feeToken.symbol),
            currency: TOKEN_REGISTRY[feeToken.symbol].currency
          }
        }
      };
    } catch (error) {
      Logger.error("FeesService.estimateFee", error);
      throw new InternalServerErrorException("Failed to compute the fee.");
    }
  }
}
