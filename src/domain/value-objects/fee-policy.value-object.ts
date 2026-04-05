import type { Chain } from "@/domain/constants/chain.constant";

export type FeePolicyValueObject = {
  method: "fixed_by_chain";
  version: "v1";
  chainKey: Chain;
};
