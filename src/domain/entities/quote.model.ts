import * as v from "valibot";
import { Address, Hex } from "viem";

import { SUPPORT_CHAIN_IDS } from "@/config/chain.config";
import { TOKENS } from "@/registries/token.registry";
import { feePolicyShape } from "@/shared/validations/shapes/fee-policy.shape";

export const QuoteModelSchema = v.object({
  quoteToken: v.string(),
  expiresAt: v.date(),
  chainId: v.picklist(SUPPORT_CHAIN_IDS),
  sender: v.pipe(
    v.string(),
    v.transform(s => s as Address)
  ),
  recipient: v.pipe(
    v.string(),
    v.transform(s => s as Address)
  ),
  token: v.object({
    symbol: v.picklist(TOKENS),
    address: v.pipe(
      v.string(),
      v.transform(s => s as Address)
    ),
    decimals: v.number()
  }),
  feeToken: v.object({
    symbol: v.picklist(TOKENS),
    address: v.pipe(
      v.string(),
      v.transform(s => s as Address)
    ),
    decimals: v.number()
  }),
  amount: v.object({
    minUnits: v.bigint(),
    decimals: v.number()
  }),
  fee: v.object({
    minUnits: v.bigint(),
    decimals: v.number()
  }),
  delegate: v.pipe(
    v.string(),
    v.transform(s => s as Address)
  ),
  sponsor: v.pipe(
    v.string(),
    v.transform(s => s as Address)
  ),
  callHash: v.pipe(
    v.string(),
    v.transform(s => s as Hex)
  ),
  policy: feePolicyShape,
  serverTime: v.date()
});

export type QuoteModel = v.InferOutput<typeof QuoteModelSchema>;
