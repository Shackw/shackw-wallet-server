import * as v from "valibot";

import { SUPPORT_CHAIN_KEYS, SUPPORT_CHAIN_IDS } from "@/configs/chain.config";

export const chainValidator = (field: string = "chain") =>
  v.pipe(
    v.string(`${field} must be a string.`),
    v.picklist(SUPPORT_CHAIN_KEYS, `${field} must be one of: ${SUPPORT_CHAIN_KEYS.join(", ")}.`)
  );

export const chainIdValidator = (field: string = "chainId") =>
  v.pipe(
    v.number(`${field} must be a number.`),
    v.picklist(SUPPORT_CHAIN_IDS, `${field} must be one of: ${SUPPORT_CHAIN_IDS.join(", ")}.`)
  );
