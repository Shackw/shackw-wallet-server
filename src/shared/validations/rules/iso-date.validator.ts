import * as v from "valibot";

export const isoDateValidator = v.pipe(
  v.string(),
  v.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/),
  v.transform(s => new Date(s))
);
