import * as v from "valibot";

import { chainKeyValidator } from "@/shared/validations/rules/chain.validator";

export const FeePolicyShape = v.object({
  method: v.literal("fixed_by_chain"),
  version: v.literal("v1"),
  chainKey: chainKeyValidator("chainKey")
});
