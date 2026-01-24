import type { FeeWithPolicy } from "../value-objects/fee-policy.value-object";
import type { AmountUnit } from "./common/amount-unit.entity";
import type { TokenInfo } from "./common/token-info.entity";
import type { Address, Hex } from "viem";

export type QuoteModel = {
  quoteToken: string;
  expiresAt: Date;
  chainId: number;
  sender: Address;
  recipient: Address;
  token: TokenInfo;
  feeToken: TokenInfo;
  amount: AmountUnit;
  delegate: Address;
  sponsor: Address;
  callHash: Hex;
  serverTime: Date;
} & FeeWithPolicy;
