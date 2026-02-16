import type { Chain } from "@/config/chain.config";
import type { MorarisTokenTransfersResponseSchema } from "@/infrastructure/http/schemas/http-moraris-token-transfer.shema";

import type * as v from "valibot";
import type { Address } from "viem";

export const CHIAN_TO_MORARIS_CHAIN = {
  mainnet: "eth",
  base: "base",
  polygon: "polygon",
  sepolia: "sepolia",
  baseSepolia: "base sepolia",
  polygonAmoy: "polygon amoy"
} as const satisfies Record<Chain, string>;

export type MoralisTokenTransfersContract = v.InferOutput<typeof MorarisTokenTransfersResponseSchema>;

export type MoralisTokenTransferItemContract = MoralisTokenTransfersContract["result"][number];

export type MoralisTokenTransfersQuery = {
  chain: Chain;
  wallet: Address;
  fromDate: number;
  toDate: number;
  tokenAddresses: Address[];
  limit: number;
  cursor?: string;
};

export interface MoralisTokenTransfersGateway {
  fetch(query: MoralisTokenTransfersQuery): Promise<MoralisTokenTransfersContract>;
}
