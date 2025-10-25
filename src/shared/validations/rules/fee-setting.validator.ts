import * as v from "valibot";

export const feeBpsValidator = (field: string) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(0, `${field} must be at least 0.`),
    v.maxValue(1000, `${field} must be at most 1000.`)
  );

export const jpycFeeCapUnitValidator = (field: string) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(0, `${field} must be at least 0.`),
    v.maxValue(500, `${field} must be at most 500.`)
  );

export const usdcFeeCapUnitValidator = (field: string) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(0, `${field} must be at least 0.`),
    v.maxValue(5, `${field} must be at most 5.`)
  );

export const eurcFeeCapUnitValidator = (field: string) =>
  v.pipe(
    v.string(),
    v.transform(s => Number(s)),
    v.number(`${field} must be a number.`),
    v.minValue(0, `${field} must be at least 0.`),
    v.maxValue(4.5, `${field} must be at most 4.5.`)
  );
