import type { Address, Hex } from "viem";

// === Contracts ===
export type ThirdwebSearchContractEventsContract = {
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
export type ThirdwebSearchContractEventsQuery = {
  chainId: number;
  tokenAddresses: Address[];
  timestampLte: number;
  timestampGte: number;
  sortOrder: "asc" | "desc";
} & ({ fromAddress: Address; toAddress?: Address } | { fromAddress?: Address; toAddress: Address });

// === Abstract Port ===
export interface ThirdwebApiGateway {
  searchContractEvents(query: ThirdwebSearchContractEventsQuery): Promise<ThirdwebSearchContractEventsContract[]>;
}
