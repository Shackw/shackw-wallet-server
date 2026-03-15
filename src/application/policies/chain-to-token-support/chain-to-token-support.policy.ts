import { Inject, Injectable } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import {
  ChainToTokenSupportInput,
  ChainToTokenSupportOutput,
  ChainToTokenSupportPolicy
} from "./chain-to-token-support.policy.types";

@Injectable()
export class DefaultChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDepRepository: TokenDeploymentRepository
  ) {
    super();
  }

  execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput {
    const { chainKey, tokenSymbol } = input;

    const tokenDep = this.tokenDepRepository.findTokenDeployment({ chainKey, tokenSymbol });
    if (!tokenDep)
      throw new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: `Token ${tokenSymbol} is not supported on chain ${chainKey}.`
      });

    return tokenDep;
  }
}
