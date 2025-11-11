import * as v from "valibot";

import { CHAIN_KEYS, CHAIN_IDS } from "@/config/chain.config";

export const chainValidator = (field: string = "chain") =>
  v.picklist(CHAIN_KEYS, `${field} must be one of: ${CHAIN_KEYS.join(", ")}.`);

export const chainIdValidator = (field: string = "chainId") =>
  v.picklist(CHAIN_IDS, `${field} must be one of: ${CHAIN_IDS.join(", ")}.`);
