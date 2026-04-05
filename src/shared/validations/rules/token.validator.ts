import * as v from "valibot";

import { TOKENS } from "@/domain/constants/token.constant";

export const tokenSymbolValidator = (field: string) =>
  v.picklist(TOKENS, `${field} must be one of: ${TOKENS.join(", ")}.`);
