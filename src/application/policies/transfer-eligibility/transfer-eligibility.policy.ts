import { Inject, Injectable } from "@nestjs/common";
import { formatUnits } from "viem/utils";

import { ApplicationError } from "@/application/errors";
import { DI_TOKENS } from "@/shared/di.tokens";

import {
  TransferEligibilityPolicy,
  type TransferEligibilityInput,
  type TransferEligibilityOutput
} from "./transfer-eligibility.policy.types";

import type { ChainToTokenSupportPolicy } from "../chain-to-token-support";

@Injectable()
export class DefaultTransferEligibilityPolicy extends TransferEligibilityPolicy {
  constructor(
    @Inject(DI_TOKENS.CHAIN_TO_TOKEN_SUPPORT_POLICY)
    private readonly chainToTokenSupport: ChainToTokenSupportPolicy
  ) {
    super();
  }

  async execute(input: TransferEligibilityInput): Promise<TransferEligibilityOutput> {
    const { chainKey, tokenSymbol, feeTokenSymbol, amountMinUnits } = input;

    const tokenDep = await this.chainToTokenSupport.execute({ chainKey, tokenSymbol });
    const feeTokenDep = await this.chainToTokenSupport.execute({ chainKey, tokenSymbol: feeTokenSymbol });

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
