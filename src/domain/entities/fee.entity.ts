import type { FeeWithPolicy } from "../value-objects/fee-policy.value-object";
import type { AmountUnitEntity } from "./common/amount-unit.entity";
import type { TokenInfoEntity } from "./common/token-info.entity";

export type FeeEntity = {
  token: TokenInfoEntity;
  feeToken: TokenInfoEntity;
  amount: AmountUnitEntity;
} & FeeWithPolicy;
