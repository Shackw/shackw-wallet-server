import type { FeeWithPolicy } from "../value-objects/fee-policy.value-object";
import type { AmountUnitEntity } from "./common/amount-unit.entity";
import type { TokenInfoEntity } from "./common/token-info.entity";
import type { Address, Hex } from "viem";

export type QuoteEntity = {
  nonce: bigint;
  quoteToken: string;
  expiresAt: Date;
  chainId: number;
  sender: Address;
  recipient: Address;
  token: TokenInfoEntity;
  feeToken: TokenInfoEntity;
  amount: AmountUnitEntity;
  delegate: Address;
  sponsor: Address;
  callHash: Hex;
  serverTime: Date;
} & FeeWithPolicy;
