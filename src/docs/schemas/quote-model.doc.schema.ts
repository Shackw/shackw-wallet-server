import * as v from "valibot";

import { QuoteModelSchema } from "@/v1/models/quote.model";

export const QuoteModelDocSchema = v.object({
  ...QuoteModelSchema.entries,

  expiresAt: v.string(),
  serverTime: v.string(),

  sender: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/)),
  recipient: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/)),
  delegate: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/)),
  sponsor: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/)),

  callHash: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{64}$/)),

  token: v.object({
    ...QuoteModelSchema.entries.token.entries,
    address: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/))
  }),
  feeToken: v.object({
    ...QuoteModelSchema.entries.feeToken.entries,
    address: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/))
  }),

  amount: v.object({
    ...QuoteModelSchema.entries.amount.entries,
    minUnits: v.pipe(v.string(), v.regex(/^\d+$/))
  }),
  fee: v.object({
    ...QuoteModelSchema.entries.fee.entries,
    minUnits: v.pipe(v.string(), v.regex(/^\d+$/))
  }),

  policy: v.object({
    ...QuoteModelSchema.entries.policy.entries,
    cap: v.object({
      ...QuoteModelSchema.entries.policy.entries.cap.entries,
      minUnit: v.pipe(v.string(), v.regex(/^\d+$/))
    })
  })
});
