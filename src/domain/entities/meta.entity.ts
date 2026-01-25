import type { CHAIN_IDS, Chain } from "@/config/chain.config";
import type { Token } from "@/registries/token-chain.registry";

export type ChainMetaEntity = {
  symbol: Chain;
  id: (typeof CHAIN_IDS)[number];
  testnet: boolean;
};

export type TokenMetaEntity = {
  symbol: Token;
  address: Record<string, string>;
  decimals: number;
};

export type FeeMetaEntity = {
  chainSymbol: Chain;
  tokenSymbol: Token;
  fixedFeeAmountUnits: string;
  fixedFeeAmountDisplay: number;
};

export type MinTransferMetaEntity = {
  chainSymbol: Chain;
  tokenSymbol: Token;
  minUnits: string;
  display: number;
};

export type ContractsMetaEntity = {
  delegate: Record<Chain, string>;
  registry: Record<Chain, string>;
  sponsor: string;
};

export type MetaSummaryEntity = {
  schemaVersion: string;
  chains: ChainMetaEntity[];
  tokens: TokenMetaEntity[];
  fixedFees: FeeMetaEntity[];
  minTransfers: MinTransferMetaEntity[];
  contracts: ContractsMetaEntity;
};
