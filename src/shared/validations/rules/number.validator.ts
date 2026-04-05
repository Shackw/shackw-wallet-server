import * as v from "valibot";

export const numberRangeValidator = (field: string, min: number, max: number) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(min, `${field} must be at least ${min}.`),
    v.maxValue(max, `${field} must be at most ${max}.`)
  );

export const numberBigintValidator = (field: string) =>
  v.pipe(
    v.number(`${field} must be a number.`),
    v.integer(`${field} must be an integer.`),
    v.maxValue(Number.MAX_SAFE_INTEGER, `${field} is too large.`),
    v.minValue(Number.MIN_SAFE_INTEGER, `${field} is too small.`),
    v.transform(n => BigInt(n))
  );

export const unixTimestampSecondsValidator = (field: string) =>
  v.pipe(
    v.number(`${field} must be a number.`),
    v.integer(`${field} must be an integer.`),
    v.minValue(0, `${field} must be >= 0.`),
    v.transform(n => new Date(n * 1000))
  );
