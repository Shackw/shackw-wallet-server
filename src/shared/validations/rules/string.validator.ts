import * as v from "valibot";

export const stringBigintValidator = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.transform(s => s.trim()),
    v.minLength(1, `${field} must not be empty.`),
    v.regex(/^\d+$/, `${field} must be an unsigned integer string (minimal units).`),
    v.transform(s => BigInt(s))
  );

export const isoDateValidator = (field: string = "date") =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
      `${field} must be an ISO 8601 UTC string (e.g., 2025-08-29T12:34:56Z).`
    ),
    v.transform(s => new Date(s))
  );

export const nullableString = (field: string) => v.nullable(v.string(`${field} must be a string`));

export const quoteTokenValidator = (field: string = "quoteToken") =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, `${field} must be base64url 'payload.mac' format.`)
  );
