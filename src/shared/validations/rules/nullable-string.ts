import * as v from "valibot";

export const nullableString = (field: string) => v.nullable(v.string(`${field} must be a string`));
