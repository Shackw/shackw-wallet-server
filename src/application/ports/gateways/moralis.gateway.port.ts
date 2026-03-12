import type { Chain } from "@/domain/constants/chain.constant";

import type { Address, Hex } from "viem";

// === Contracts ===
export type MoralisSearchTransfersContract = {
  txHash: Hex;
  blockNumber: bigint;
  logIndex: number;
  tokenAddress: Address;
  fromAddress: Address;
  toAddress: Address;
  valueMinUnits: bigint;
  transferredAt: Date;
};

// === Queries ===
export type MoralisSearchTransfersQuery = {
  chain: Chain;
  tokenAddresses: Address[];
  wallet: Address;
  timestampLte: number;
  timestampGte: number;
  sortOrder: "asc" | "desc";
};

// === Abstract Port ===
export interface MoralisGateway {
  searchTransfers(query: MoralisSearchTransfersQuery): Promise<MoralisSearchTransfersContract[]>;
}
