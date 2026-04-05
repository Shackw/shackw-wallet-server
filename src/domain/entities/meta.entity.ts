import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";

import type { Address } from "viem";

export type ChainMetaEntity = {
  key: Chain;
  id: number;
  testnet: boolean;
};

export type TokenMetaEntity = {
  symbol: Token;
  address: Partial<Record<Chain, Address>>;
  decimals: number;
};

export type FeeMetaEntity = {
  chainKey: Chain;
  tokenSymbol: Token;
  fixedFeeAmountUnits: bigint;
  fixedFeeAmountDisplay: number;
};

export type MinTransferMetaEntity = {
  chainKey: Chain;
  tokenSymbol: Token;
  minTransferAmountUnits: bigint;
  minTransferAmountDisplay: number;
};

export type ContractsMetaEntity = {
  sponsor: Record<Chain, Address>;
  delegate: Record<Chain, Address>;
  registry: Record<Chain, Address>;
};

export type MetaSummaryEntity = {
  schemaVersion: string;
  chains: ChainMetaEntity[];
  tokens: TokenMetaEntity[];
  fixedFees: FeeMetaEntity[];
  minTransfers: MinTransferMetaEntity[];
  contracts: ContractsMetaEntity;
};
