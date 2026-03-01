import type { TokenDeploymentContract } from "@/application/ports/config/token-deployment.repository.port";
import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

// === Input ===
export type TransferEligibilityInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;

// === Output ===
export type TransferEligibilityOutput = {
  chain: TokenDeploymentContract["chain"];
  tokenDep: Pick<TokenDeploymentContract, "token" | "fixedFeeAmountUnits">;
  feeTokenDep: Pick<TokenDeploymentContract, "token" | "fixedFeeAmountUnits">;
  contracts: TokenDeploymentContract["contracts"];
  feePolicy: {
    method: "fixed_by_chain";
    version: "v1";
    chainKey: Chain;
  };
};
