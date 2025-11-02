import { Address, Hex } from "viem";

import { FeeWithPolicy } from "../value-objects/fee-policy.value-object";

import { AmountUnit } from "./common/amount-unit.entity";
import { TokenInfo } from "./common/token-info.entity";

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
