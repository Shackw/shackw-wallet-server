import * as v from "valibot";

import { FeeModelSchema } from "@/v1/models/fee.model";

export const FeeModelDocSchema = v.object({
  ...FeeModelSchema.entries,
  token: v.object({
    ...FeeModelSchema.entries.token.entries,
    address: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/))
  }),
  feeToken: v.object({
    ...FeeModelSchema.entries.feeToken.entries,
    address: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{40}$/))
  }),
  feeMinUnits: v.pipe(v.string(), v.regex(/^\d+$/)),
  policy: v.object({
    ...FeeModelSchema.entries.policy.entries,
    cap: v.object({
      ...FeeModelSchema.entries.policy.entries.cap.entries,
      minUnit: v.pipe(v.string(), v.regex(/^\d+$/))
    })
  })
});
