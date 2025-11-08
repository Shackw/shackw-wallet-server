import * as v from "valibot";

export const stringBigintValidator = (field: string) =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.transform(s => s.trim()),
    v.minLength(1, `${field} must not be empty.`),
    v.regex(/^\d+$/, `${field} must be an unsigned integer string (minimal units).`),
    v.transform(s => BigInt(s))
  );
