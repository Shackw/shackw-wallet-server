import { Injectable, Inject } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import { Erc20Adapter } from "@/application/ports/adapters/erc20.adapter.port";
import { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { BalanceSufficiencyPolicy, EnsureSufficientBalanceInput } from "./balance-sufficiency.policy.types";

@Injectable()
export class DefaultBalanceSufficiencyPolicy extends BalanceSufficiencyPolicy {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDepRepository: TokenDeploymentRepository,

    @Inject(DI_TOKENS.ERC20_ADAPTER)
    private readonly erc20Adapter: Erc20Adapter
  ) {
    super();
  }

  async ensure(input: EnsureSufficientBalanceInput): Promise<void> {
    const { chainKey, owner, tokenAddress, tokenRequiredMinUnits, feeTokenAddress, feeRequiredMinUnits } = input;

    const tokenMaster = this.tokenDepRepository.findTokenMasterByAddress({ chainKey, address: tokenAddress });
    if (!tokenMaster)
      throw new ApplicationError({ code: "TOKEN_ADDRESS_UNKNOWN", message: `Unknown token address: ${tokenAddress}` });

    const feeTokenMaster = this.tokenDepRepository.findTokenMasterByAddress({
      chainKey,
      address: feeTokenAddress
    });
    if (!feeTokenMaster)
      throw new ApplicationError({
        code: "TOKEN_ADDRESS_UNKNOWN",
        message: `Unknown feeToken address: ${feeTokenAddress}`
      });

    const balToken = await this.erc20Adapter.getBalance({
      chainKey,
      tokenAddress,
      owner
    });

    if (tokenMaster.symbol === feeTokenMaster.symbol) {
      const required = tokenRequiredMinUnits + feeRequiredMinUnits;
      if (balToken < required)
        throw new ApplicationError({
          code: "INSUFFICIENT_COMBINED_BALANCE",
          message: `Insufficient ${tokenMaster.symbol} balance: required ${required} minimal units (amount ${tokenRequiredMinUnits} + fee ${feeRequiredMinUnits}), but sender has ${balToken}.`
        });
    } else {
      const balFeeToken = await this.erc20Adapter.getBalance({
        chainKey,
        tokenAddress: feeTokenAddress,
        owner
      });

      if (balToken < tokenRequiredMinUnits)
        throw new ApplicationError({
          code: "INSUFFICIENT_SEND_BALANCE",
          message: `Insufficient ${tokenMaster.symbol} balance: required ${tokenRequiredMinUnits} minimal units, but sender has ${balToken}.`
        });

      if (balFeeToken < feeRequiredMinUnits)
        throw new ApplicationError({
          code: "INSUFFICIENT_FEE_BALANCE",
          message: `Insufficient ${feeTokenMaster.symbol} balance for fee: required ${feeRequiredMinUnits} minimal units, but sender has ${balFeeToken}.`
        });
    }
  }
}
