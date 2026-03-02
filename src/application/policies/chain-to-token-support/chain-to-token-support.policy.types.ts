import type { TokenDeploymentContract } from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

// === Input ===
export type ChainToTokenSupportInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
}>;

// === Output ===
export type ChainToTokenSupportOutput = Readonly<TokenDeploymentContract>;
