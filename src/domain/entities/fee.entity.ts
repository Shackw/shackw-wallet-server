import type { FeeWithPolicy } from "../value-objects/fee-policy.value-object";
import type { AmountUnit } from "./common/amount-unit.entity";
import type { TokenInfo } from "./common/token-info.entity";

export type FeeModel = {
  token: TokenInfo;
  feeToken: TokenInfo;
  amount: AmountUnit;
} & FeeWithPolicy;
