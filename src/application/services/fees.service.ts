import { FeeModel } from "@/domain/entities/fee.entity";
import { FeeValueObject } from "@/domain/value-objects/fee-policy.value-object";
import { EstimateFeeRequestDto } from "@/interfaces/dto/fees.dto";
import { TOKEN_REGISTRY, resolveTokenAddress } from "@/registries/token-chain.registry";

export class FeesService {
  constructor() {}

  estimateFee(dto: EstimateFeeRequestDto): FeeModel {
    const { chain, amountMinUnits, token, feeToken } = dto;

    const feeValueObject = FeeValueObject.create(chain, feeToken.symbol);
    const { fee, policy } = feeValueObject.apply();

    return {
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
      policy
    };
  }
}
