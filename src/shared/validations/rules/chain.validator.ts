import * as v from "valibot";

import { CHAIN_KEYS } from "@/domain/constants/chain.constant";

export const chainKeyValidator = (field: string) =>
  v.picklist(CHAIN_KEYS, `${field} must be one of: ${CHAIN_KEYS.join(", ")}.`);
