import type { FeePolicyValueObject } from "../value-objects/fee-policy.value-object";
import type { TokenAmountValueObject } from "../value-objects/token-amount.value-object";
import type { TokenDescriptorValueObject } from "../value-objects/token-descriptor.value-object";
import type { Address, Hex } from "viem";

export type QuoteEntity = {
  nonce: bigint;
  quoteToken: string;
  expiresAt: Date;
  serverTime: Date;
  chainId: number;
  delegate: Address;
  sponsor: Address;
  sender: Address;
  recipient: Address;
  token: TokenDescriptorValueObject;
  feeToken: TokenDescriptorValueObject;
  amount: TokenAmountValueObject;
  fee: TokenAmountValueObject;
  policy: FeePolicyValueObject;
  callHash: Hex;
};
