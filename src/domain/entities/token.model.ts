import * as v from "valibot";
import { Hex } from "viem";

export const TransferTokenModelSchema = v.object({
  status: v.literal("submitted"),
  txHash: v.pipe(
    v.string(),
    v.transform(s => s as Hex)
  ),
  notify: v.optional(
    v.object({
      webhook: v.object({
        id: v.string(),
        echo: v.string()
      })
    })
  )
});
export type TransferTokenModel = v.InferOutput<typeof TransferTokenModelSchema>;
