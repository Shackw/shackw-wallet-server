import * as v from "valibot";

import { SUPPORT_CHAIN_KEYS, SUPPORT_CHAIN_IDS } from "@/configs/chain.config";

export const chainValidator = (field: string = "chain") =>
  v.picklist(SUPPORT_CHAIN_KEYS, `${field} must be one of: ${SUPPORT_CHAIN_KEYS.join(", ")}.`);

export const chainIdValidator = (field: string = "chainId") =>
  v.picklist(SUPPORT_CHAIN_IDS, `${field} must be one of: ${SUPPORT_CHAIN_IDS.join(", ")}.`);
