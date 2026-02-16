import type { Chain } from "@/config/chain.config";

export type FeePolicyValueObject = {
  method: "fixed_by_chain";
  version: "v1";
  chainKey: Chain;
};
