import * as v from "valibot";

import { TransferTokenModelSchema } from "@/v1/models/token.model";

export const TransferTokenModelDocSchema = v.object({
  ...TransferTokenModelSchema.entries,

  txHash: v.pipe(v.string(), v.regex(/^0x[a-fA-F0-9]{64}$/))
});
