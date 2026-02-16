import * as v from "valibot";

import { CHAIN_KEYS } from "@/config/chain.config";

export const chainKeyValidator = (field: string = "chain") =>
  v.picklist(CHAIN_KEYS, `${field} must be one of: ${CHAIN_KEYS.join(", ")}.`);
