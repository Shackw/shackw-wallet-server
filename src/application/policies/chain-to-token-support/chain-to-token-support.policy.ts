import { Inject, Injectable } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import type { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import { DI_TOKENS } from "@/shared/di.tokens";

import {
  ChainToTokenSupportPolicy,
  type ChainToTokenSupportInput,
  type ChainToTokenSupportOutput
} from "./chain-to-token-support.policy.types";

@Injectable()
export class DefaultChainToTokenSupportPolicy extends ChainToTokenSupportPolicy {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDepRepository: TokenDeploymentRepository
  ) {
    super();
  }

  async execute(input: ChainToTokenSupportInput): Promise<ChainToTokenSupportOutput> {
    const { chainKey, tokenSymbol } = input;

    const tokenDep = await this.tokenDepRepository.findTokenDeployment({ chainKey, tokenSymbol });
    if (!tokenDep)
      throw new ApplicationError({
        code: "UNSUPPORTED_TOKEN_FOR_CHAIN",
        message: `Token ${tokenSymbol} is not supported on chain ${chainKey}.`
      });

    return tokenDep;
  }
}
