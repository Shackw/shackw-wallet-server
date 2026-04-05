import type { FeePolicyValueObject } from "../value-objects/fee-policy.value-object";
import type { TokenAmountValueObject } from "../value-objects/token-amount.value-object";
import type { TokenDescriptorValueObject } from "../value-objects/token-descriptor.value-object";

export type FeeEntity = {
  token: TokenDescriptorValueObject;
  feeToken: TokenDescriptorValueObject;
  amount: TokenAmountValueObject;
  fee: TokenAmountValueObject;
  policy: FeePolicyValueObject;
};
