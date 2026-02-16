import type { TokenDeploymentContract } from "@/application/ports/token-deployment.repository.port";
import type { Chain } from "@/config/chain.config";
import type { Token } from "@/config/token.config";

export type TransferEligibilityInput = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
  feeTokenSymbol: Token;
  amountMinUnits: bigint;
}>;

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
