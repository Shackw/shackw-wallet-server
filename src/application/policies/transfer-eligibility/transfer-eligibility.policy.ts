import { Injectable } from "@nestjs/common";
import { formatUnits } from "viem";

import { ApplicationError } from "@/application/errors";

import { ChainToTokenSupportPolicy } from "../chain-to-token-support";

import type { TransferEligibilityInput, TransferEligibilityOutput } from "./transfer-eligibility.policy.types";

@Injectable()
export class TransferEligibilityPolicy {
  constructor(private readonly chainToTokenSupport: ChainToTokenSupportPolicy) {}

  execute(input: TransferEligibilityInput): TransferEligibilityOutput {
    const { chainKey, tokenSymbol, feeTokenSymbol, amountMinUnits } = input;

    const tokenDep = this.chainToTokenSupport.execute({ chainKey, tokenSymbol });
    const feeTokenDep = this.chainToTokenSupport.execute({ chainKey, tokenSymbol: feeTokenSymbol });

    if (amountMinUnits < tokenDep.minTransferAmountUnits)
      throw new ApplicationError({
        code: "TRANSFER_AMOUNT_BELOW_MINIMUM",
        message: `Minimum transferable amount for ${tokenDep.token.symbol} is ${formatUnits(
          tokenDep.minTransferAmountUnits,
          tokenDep.token.decimals
        )} ${tokenDep.token.symbol} (${tokenDep.minTransferAmountUnits.toString()} minimal units).`
      });

    return {
      chain: tokenDep.chain,
      tokenDep: {
        token: tokenDep.token,
        fixedFeeAmountUnits: tokenDep.fixedFeeAmountUnits
      },
      feeTokenDep: {
        token: feeTokenDep.token,
        fixedFeeAmountUnits: feeTokenDep.fixedFeeAmountUnits
      },
      contracts: tokenDep.contracts,
      feePolicy: {
        method: "fixed_by_chain",
        version: "v1",
        chainKey: tokenDep.chain.key
      }
    };
  }
}
