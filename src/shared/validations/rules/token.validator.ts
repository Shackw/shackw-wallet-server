import * as v from "valibot";

import { TOKENS } from "@/config/token.config";

export const tokenSymbolValidator = (field: string) =>
  v.picklist(TOKENS, `${field} must be one of: ${TOKENS.join(", ")}.`);
