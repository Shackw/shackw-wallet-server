import * as v from "valibot";

import { TOKENS } from "@/registries/token.registry";

export const tokenValidator = (field: string) =>
  v.object(
    {
      symbol: v.pipe(
        v.string(`${field}.symbol must be a string.`),
        v.picklist(TOKENS, `${field}.symbol must be one of: ${TOKENS.join(", ")}.`)
      )
    },
    `${field} must be an object. Required fields: symbol`
  );
