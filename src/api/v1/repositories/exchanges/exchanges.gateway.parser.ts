import * as v from "valibot";

import { CURRENCIES } from "@/registries/token.registry";

export const FetchExchangeResponseSchema = v.object({
  amount: v.number(),
  base: v.pipe(v.string(), v.picklist(CURRENCIES)),
  date: v.pipe(
    v.string(),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD expected)"),
    v.transform(s => new Date(s))
  ),
  rates: v.record(v.picklist(CURRENCIES), v.number())
});
