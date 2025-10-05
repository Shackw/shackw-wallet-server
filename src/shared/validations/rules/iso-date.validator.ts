import * as v from "valibot";

export const isoDateValidator = (field: string = "date") =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
      `${field} must be an ISO 8601 UTC string (e.g., 2025-08-29T12:34:56Z).`
    ),
    v.transform(s => new Date(s))
  );
