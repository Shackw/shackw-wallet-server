import type { EnsureSufficientBalanceInput } from "@/application/policies/balance-sufficiency";
import { BalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";

export class StubBalanceSufficiencyPolicy extends BalanceSufficiencyPolicy {
  ensure(_input: EnsureSufficientBalanceInput): Promise<void> {
    return Promise.resolve();
  }
}
