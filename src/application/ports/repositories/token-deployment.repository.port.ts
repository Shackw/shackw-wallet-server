import type { Chain } from "@/domain/constants/chain.constant";
import type { Currency } from "@/domain/constants/currency.constant";
import type { Token } from "@/domain/constants/token.constant";

import type { Address, Chain as ViemChain } from "viem";

// === Contracts ===
export type TokenMasterContract = {
  symbol: Token;
  currency: Currency;
  decimals: number;
};

export type ChainMasterContract = {
  key: Chain;
  id: number;
  rpcUrl: string;
  viem: ViemChain;
  contracts: {
    delegate: Address;
    registry: Address;
  };
};

export type TokenDeploymentContract = {
  token: { address: Address } & TokenMasterContract;
  chain: Pick<ChainMasterContract, "key" | "id" | "rpcUrl" | "viem">;
  contracts: {
    delegate: Address;
    registry: Address;
  };
  minTransferAmountUnits: bigint;
  fixedFeeAmountUnits: bigint;
};

// === Queries ===
export type FindTokenMasterByAddressQuery = Readonly<{
  address: Address;
  chainKey: Chain;
}>;

export type FindChainMasterQuery = Readonly<{
  chainKey: Chain;
}>;

export type FindTokenDeploymentQuery = Readonly<{
  chainKey: Chain;
  tokenSymbol: Token;
}>;

// === Abstract Port ===
export interface TokenDeploymentRepository {
  findTokenMasterByAddress(query: FindTokenMasterByAddressQuery): TokenMasterContract | null;

  listChainMasters(): ChainMasterContract[];
  findChainMaster(query: FindChainMasterQuery): ChainMasterContract;

  listTokenDeployment(): TokenDeploymentContract[];
  findTokenDeployment(query: FindTokenDeploymentQuery): TokenDeploymentContract | null;
}
