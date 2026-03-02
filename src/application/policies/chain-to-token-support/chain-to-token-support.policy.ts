import { Inject, Injectable } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import type { ChainToTokenSupportInput, ChainToTokenSupportOutput } from "./chain-to-token-support.policy.types";

@Injectable()
export class ChainToTokenSupport {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDeploymentRepository: TokenDeploymentRepository
  ) {}

  execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
    const { chainKey, tokenSymbol } = input;

    const tokenDep = this.tokenDeploymentRepository.findTokenDeployment({ chainKey, tokenSymbol });
    if (!tokenDep)
      throw new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: `Token ${tokenSymbol} is not supported on chain ${chainKey}.`
      });

    return tokenDep;
  }
}
