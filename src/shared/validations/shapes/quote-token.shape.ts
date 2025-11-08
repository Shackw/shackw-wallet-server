import * as v from "valibot";

export const QuoteTokenShape = v.pipe(
  v.string("quoteToken must be a string."),
  v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, "quoteToken must be base64url 'payload.mac' format.")
);
