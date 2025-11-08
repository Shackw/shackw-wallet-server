import { Address } from "viem";

import { SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";

export const DELEGATE_CONTRACT_ADDRESS_REGISTORY: Record<SupportChain, Address> = {
  main: ENV.MAIN_DELEGATE_ADDRESS,
  base: ENV.BASE_DELEGATE_ADDRESS,
  polygon: ENV.POLYGON_DELEGATE_ADDRESS
};

export const REGISTRY_CONTRACT_ADDRESS_REGISTORY: Record<SupportChain, Address> = {
  main: ENV.MAIN_REGISTRY_ADDRESS,
  base: ENV.BASE_REGISTRY_ADDRESS,
  polygon: ENV.POLYGON_REGISTRY_ADDRESS
};
