import type { TokenDeploymentContract } from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

// === Abstract ===
export abstract class ChainToTokenSupportPolicy {
  abstract execute(input: ChainToTokenSupportInput): ChainToTokenSupportOutput;
}

// === Input ===
export type ChainToTokenSupportInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
}>;

// === Output ===
export type ChainToTokenSupportOutput = Readonly<TokenDeploymentContract>;
