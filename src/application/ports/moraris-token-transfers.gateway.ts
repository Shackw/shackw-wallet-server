import type { Chain } from "@/config/chain.config";
import type { MorarisTokenTransfersResponseSchema } from "@/shared/validations/schemas/http-moraris-token-transfer.shema";

import type * as v from "valibot";
import type { Address } from "viem";

export interface MorarisTokenTransfersGateway {
  fetch(query: MorarisTokenTransfersQuery): Promise<MorarisTokenTransfersResult>;
}

export const CHIAN_TO_MORARIS_CHAIN = {
  mainnet: "eth",
  base: "base",
  polygon: "polygon",
  sepolia: "sepolia",
  baseSepolia: "base sepolia",
  polygonAmoy: "polygon amoy"
} as const satisfies Record<Chain, string>;

export type MorarisTokenTransfersQuery = {
  chain: Chain;
  wallet: Address;
  fromDate: number;
  toDate: number;
  tokenAddresses: Address[];
  limit: number;
  cursor?: string;
};

export type MorarisTokenTransferItem = MorarisTokenTransfersResult["result"][number];

export type MorarisTokenTransfersResult = v.InferOutput<typeof MorarisTokenTransfersResponseSchema>;
