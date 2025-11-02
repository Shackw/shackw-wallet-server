import * as v from "valibot";

import { CURRENCIES } from "@/registries/token.registry";

export const feePolicyShape = v.object({
  method: v.literal("bps_with_cap"),
  version: v.literal("v1"),
  bps: v.number(),
  cap: v.object({
    minUnit: v.bigint(),
    currency: v.picklist(CURRENCIES)
  })
});
