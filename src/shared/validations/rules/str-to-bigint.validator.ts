import * as v from "valibot";

export const strToBigintValidator = v.pipe(
  v.string(),
  v.transform(v => BigInt(v))
);
