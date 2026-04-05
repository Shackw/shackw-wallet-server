import * as v from "valibot";

import type {
  MetaSummaryEntity,
  ChainMetaEntity,
  TokenMetaEntity,
  FeeMetaEntity,
  MinTransferMetaEntity,
  ContractsMetaEntity
} from "@/domain/entities/meta.entity";

import {
  type GetMetaSummaryResponseDto,
  type GetChainMetaResponseDto,
  type GetTokenMetaResponseDto,
  type GeFeeMetaResponseDto,
  type GetMinTransferMetaResponseDto,
  type GetContractsMetaResponseDto,
  GetChainMetaResponseDtoSchema,
  GetContractsMetaResponseDtoSchema,
  GetFeeMetaResponseDtoSchema,
  GetMetaSummaryResponseDtoSchema,
  GetMinTransferMetaResponseDtoSchema,
  GetTokenMetaResponseDtoSchema
} from "./meta.dto";

export const toGetMetaSummaryResponseDto = (entity: MetaSummaryEntity): GetMetaSummaryResponseDto => {
  return v.parse(GetMetaSummaryResponseDtoSchema, entity);
};

export const toGetChainMetaResponseDto = (entities: ChainMetaEntity[]): GetChainMetaResponseDto => {
  return v.parse(GetChainMetaResponseDtoSchema, entities);
};

export const toGetTokenMetaResponseDto = (entities: TokenMetaEntity[]): GetTokenMetaResponseDto => {
  return v.parse(GetTokenMetaResponseDtoSchema, entities);
};

export const toGeFeeMetaResponseDto = (entities: FeeMetaEntity[]): GeFeeMetaResponseDto => {
  return v.parse(GetFeeMetaResponseDtoSchema, entities);
};

export const toGetMinTransferMetaResponseDto = (entities: MinTransferMetaEntity[]): GetMinTransferMetaResponseDto => {
  return v.parse(GetMinTransferMetaResponseDtoSchema, entities);
};

export const toGetContractsMetaResponseDto = (entity: ContractsMetaEntity): GetContractsMetaResponseDto => {
  return v.parse(GetContractsMetaResponseDtoSchema, entity);
};
