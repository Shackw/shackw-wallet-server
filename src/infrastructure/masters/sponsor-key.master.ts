import { ENV } from "@/config/env.config";
import type { Chain } from "@/domain/constants/chain.constant";

import type { Hex } from "viem";

type SponsorKeyMaster = Record<Chain, Hex>;

export const SPONSOR_KEY_MASTER = {
  mainnet: ENV.SPONSOR_PK,
  base: ENV.SPONSOR_PK,
  polygon: ENV.SPONSOR_PK,
  sepolia: ENV.SPONSOR_PK,
  baseSepolia: ENV.SPONSOR_PK,
  polygonAmoy: ENV.SPONSOR_PK
} as const satisfies SponsorKeyMaster;
