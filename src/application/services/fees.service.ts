import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common";

import { FeeModel } from "@/domain/entities/fee.model";
import { EstimateFeeRequestDto } from "@/interfaces/dto/fees.dto";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDecimals, toMinUnits } from "@/shared/helpers/token-units.helper";

import { EXCHANGE_GATEWAY, ExchangeGateway, FetchExchangePayload } from "../ports/exchanges.gateway.interface";

@Injectable()
export class FeesService {
  constructor(
    @Inject(EXCHANGE_GATEWAY)
    private readonly exchangeGateway: ExchangeGateway
  ) {}

  async estimateFee(dto: EstimateFeeRequestDto): Promise<FeeModel> {
    const { chain, amountMinUnits, token, feeToken } = dto;

    const bps = FEE_REGISTORY[chain][token.symbol].bps;
    const maxFeeDecimals = FEE_REGISTORY[chain][feeToken.symbol].capUnits;

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
          address: TOKEN_REGISTRY[token.symbol].address[chain],
          decimals: TOKEN_REGISTRY[token.symbol].decimals
        },
        feeToken: {
          symbol: feeToken.symbol,
          address: TOKEN_REGISTRY[feeToken.symbol].address[chain],
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
    } catch (e) {
      throw new InternalServerErrorException("Failed to compute the fee.", { cause: e });
    }
  }
}
