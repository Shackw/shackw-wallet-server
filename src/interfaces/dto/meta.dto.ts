import * as v from "valibot";

import { addressValidator } from "@/shared/validations/rules/address.validator";
import { chainKeyValidator } from "@/shared/validations/rules/chain.validator";
import { tokenSymbolValidator } from "@/shared/validations/rules/token.validator";

// === Response Schemas ====
export const GetChainMetaResponseDtoSchema = v.array(
  v.object({
    key: chainKeyValidator(),
    id: v.number(),
    testnet: v.boolean()
  })
);

export const GetTokenMetaResponseDtoSchema = v.array(
  v.object({
    symbol: tokenSymbolValidator(),
    address: v.record(chainKeyValidator(), v.optional(addressValidator("token.address"))),
    decimals: v.number()
  })
);

export const GetFeeMetaResponseDtoSchema = v.array(
  v.object({
    chainKey: chainKeyValidator(),
    tokenSymbol: tokenSymbolValidator(),
    fixedFeeAmountUnits: v.bigint(),
    fixedFeeAmountDisplay: v.number()
  })
);

export const GetMinTransferMetaResponseDtoSchema = v.array(
  v.object({
    chainKey: chainKeyValidator(),
    tokenSymbol: tokenSymbolValidator(),
    minTransferAmountUnits: v.bigint(),
    minTransferAmountDisplay: v.number()
  })
);

export const GetContractsMetaResponseDtoSchema = v.object({
  delegate: v.record(chainKeyValidator(), addressValidator("contracts.delegate")),
  registry: v.record(chainKeyValidator(), addressValidator("contracts.registry")),
  sponsor: addressValidator("contracts.sponsor")
});

export const GetMetaSummaryResponseDtoSchema = v.object({
  schemaVersion: v.string(),
  chains: GetChainMetaResponseDtoSchema,
  tokens: GetTokenMetaResponseDtoSchema,
  fixedFees: GetFeeMetaResponseDtoSchema,
  minTransfers: GetMinTransferMetaResponseDtoSchema,
  contracts: GetContractsMetaResponseDtoSchema
});

// === Response DTOs ====
export type GetMetaSummaryResponseDto = v.InferOutput<typeof GetMetaSummaryResponseDtoSchema>;

export type GetChainMetaResponseDto = v.InferOutput<typeof GetChainMetaResponseDtoSchema>;

export type GetTokenMetaResponseDto = v.InferOutput<typeof GetTokenMetaResponseDtoSchema>;

export type GeFeeMetaResponseDto = v.InferOutput<typeof GetFeeMetaResponseDtoSchema>;

export type GetMinTransferMetaResponseDto = v.InferOutput<typeof GetMinTransferMetaResponseDtoSchema>;

export type GetContractsMetaResponseDto = v.InferOutput<typeof GetContractsMetaResponseDtoSchema>;
