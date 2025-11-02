import { FeeWithPolicy } from "../value-objects/fee-policy.value-object";

import { AmountUnit } from "./common/amount-unit.entity";
import { TokenInfo } from "./common/token-info.entity";

export type FeeModel = {
  token: TokenInfo;
  feeToken: TokenInfo;
  amount: AmountUnit;
} & FeeWithPolicy;
