import { Controller, Get, UseGuards } from "@nestjs/common";

import { MetaService } from "@/application/services/meta";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";

import {
  toGetMetaSummaryResponseDto,
  toGetChainMetaResponseDto,
  toGetTokenMetaResponseDto,
  toGeFeeMetaResponseDto,
  toGetMinTransferMetaResponseDto,
  toGetContractsMetaResponseDto
} from "./meta.mapper";

import type {
  GetMetaSummaryResponseDto,
  GetChainMetaResponseDto,
  GetTokenMetaResponseDto,
  GeFeeMetaResponseDto,
  GetMinTransferMetaResponseDto,
  GetContractsMetaResponseDto
} from "./meta.dto";

@Controller("meta")
@UseGuards(AppCheckGuard)
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Get("summary")
  async summary(): Promise<GetMetaSummaryResponseDto> {
    const entity = await this.meta.getMetaSummary();
    return toGetMetaSummaryResponseDto(entity);
  }

  @Get("chains")
  async chains(): Promise<GetChainMetaResponseDto> {
    const entities = await this.meta.getChainsMeta();
    return toGetChainMetaResponseDto(entities);
  }

  @Get("tokens")
  async tokens(): Promise<GetTokenMetaResponseDto> {
    const entities = await this.meta.getTokensMeta();
    return toGetTokenMetaResponseDto(entities);
  }

  @Get("fees")
  async fees(): Promise<GeFeeMetaResponseDto> {
    const entities = await this.meta.getFeesMeta();
    return toGeFeeMetaResponseDto(entities);
  }

  @Get("min-transfers")
  async minTransfer(): Promise<GetMinTransferMetaResponseDto> {
    const entities = await this.meta.getMinTransfersMeta();
    return toGetMinTransferMetaResponseDto(entities);
  }

  @Get("contracts")
  async contracts(): Promise<GetContractsMetaResponseDto> {
    const entity = await this.meta.getContractsMeta();
    return toGetContractsMetaResponseDto(entity);
  }
}
