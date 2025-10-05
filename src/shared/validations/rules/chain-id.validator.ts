import * as v from "valibot";

import { DEFAULT_CHAIN } from "@/configs/chain.config";

export const chainIdValidator = (field: string = "chainId") =>
  v.pipe(v.number(`${field} must be a number.`), v.literal(DEFAULT_CHAIN.id, `${field} must be ${DEFAULT_CHAIN.id}.`));
