import { Inject, Injectable } from "@nestjs/common";
import { formatUnits } from "viem";

import { ApplicationError } from "@/application/errors";
import { TokenDeploymentRepository } from "@/application/ports/token-deployment.repository.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import type { TransferEligibilityInput, TransferEligibilityOutput } from "./transfer-eligibility.policy.types";

@Injectable()
export class TransferEligibilityPolicy {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDeploymentRepository: TokenDeploymentRepository
  ) {}

  execute(input: TransferEligibilityInput): TransferEligibilityOutput {
    const { chainKey, tokenSymbol, feeTokenSymbol, amountMinUnits } = input;

    const tokenDep = this.tokenDeploymentRepository.findTokenDeployment({ chainKey, tokenSymbol });
    if (!tokenDep) {
      throw new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: `Token ${tokenSymbol} is not supported on chain ${chainKey}.`
      });
    }

    const feeTokenDep = this.tokenDeploymentRepository.findTokenDeployment({ chainKey, tokenSymbol: feeTokenSymbol });
    if (!feeTokenDep) {
      throw new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: `Token ${feeTokenSymbol} is not supported on chain ${chainKey}.`
      });
    }

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
