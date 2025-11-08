import * as v from "valibot";

export const numberRangeValidator = (field: string, min: number, max: number) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(min, `${field} must be at least 0.`),
    v.maxValue(max, `${field} must be at most 4.5.`)
  );
