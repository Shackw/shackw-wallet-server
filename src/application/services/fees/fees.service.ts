import type { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import type { FeeEntity } from "@/domain/entities/fee.entity";

import type { EstimateFeeInput } from "./fees.service.types";

export class FeesService {
  constructor(private readonly eligibilityPolicy: TransferEligibilityPolicy) {}

  estimateFee(input: EstimateFeeInput): FeeEntity {
    const { chainKey, tokenSymbol, feeTokenSymbol, amountMinUnits } = input;

    const { tokenDep, feeTokenDep, feePolicy } = this.eligibilityPolicy.execute({
      chainKey,
      tokenSymbol,
      feeTokenSymbol,
      amountMinUnits
    });

    return {
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
      policy: feePolicy
    };
  }
}
