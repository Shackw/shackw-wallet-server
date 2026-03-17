import type { TokenDeploymentContract } from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

// === Abstract ===
export abstract class TransferEligibilityPolicy {
  abstract execute(input: TransferEligibilityInput): Promise<TransferEligibilityOutput>;
}

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
