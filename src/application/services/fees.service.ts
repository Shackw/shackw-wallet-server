import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common";

import { FeeModel } from "@/domain/entities/fee.entity";
import { FeeValueObject } from "@/domain/value-objects/fee-policy.value-object";
import { EstimateFeeRequestDto } from "@/interfaces/dto/fees.dto";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY } from "@/registries/token.registry";

import { EXCHANGE_GATEWAY, ExchangeGateway } from "../ports/exchanges.gateway.interface";

@Injectable()
export class FeesService {
  constructor(
    @Inject(EXCHANGE_GATEWAY)
    private readonly exchangeGateway: ExchangeGateway
  ) {}

  async estimateFee(dto: EstimateFeeRequestDto): Promise<FeeModel> {
    const { chain, amountMinUnits, token, feeToken } = dto;
    const { bps, capUnits, quantumUnits } = FEE_REGISTORY[chain][feeToken.symbol];

    const feeValueObject = FeeValueObject.create(bps, capUnits, quantumUnits);
    try {
      const exchangeRate = await this.exchangeGateway.fetchRate({
        base: TOKEN_REGISTRY[token.symbol].currency,
        symbol: TOKEN_REGISTRY[feeToken.symbol].currency
      });

      const { fee, policy } = feeValueObject.apply(amountMinUnits, token.symbol, feeToken.symbol, exchangeRate);

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
        amount: {
          symbol: token.symbol,
          minUnits: amountMinUnits,
          decimals: TOKEN_REGISTRY[token.symbol].decimals
        },
        fee,
        policy
      };
    } catch (e) {
      throw new InternalServerErrorException("Failed to compute the fee.", { cause: e });
    }
  }
}
