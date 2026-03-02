import { Controller, UseGuards, UseFilters, Get } from "@nestjs/common";

import { MetaService } from "@/application/services/meta";
import { HttpExceptionsFilter } from "@/interfaces/common/filters/http-exception.filter";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";

import {
  toGetMetaSummaryResponseDto,
  toGetChainMetaResponseDto,
  toGetTokenMetaResponseDto,
  toGeFeeMetaResponseDto,
  toGetMinTransferMetaResponseDto,
  toGetContractsMetaResponseDto
} from "./meta.entity-to-response";

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
@UseFilters(HttpExceptionsFilter)
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get("summary")
  summary(): GetMetaSummaryResponseDto {
    const entity = this.metaService.getMetaSummary();
    return toGetMetaSummaryResponseDto(entity);
  }

  @Get("chains")
  chains(): GetChainMetaResponseDto {
    const entities = this.metaService.getChainsMeta();
    return toGetChainMetaResponseDto(entities);
  }

  @Get("tokens")
  tokens(): GetTokenMetaResponseDto {
    const entities = this.metaService.getTokensMeta();
    return toGetTokenMetaResponseDto(entities);
  }

  @Get("fees")
  fees(): GeFeeMetaResponseDto {
    const entities = this.metaService.getFeesMeta();
    return toGeFeeMetaResponseDto(entities);
  }

  @Get("min-transfers")
  minTransfer(): GetMinTransferMetaResponseDto {
    const entities = this.metaService.getMinTransfersMeta();
    return toGetMinTransferMetaResponseDto(entities);
  }

  @Get("contracts")
  contracts(): GetContractsMetaResponseDto {
    const entity = this.metaService.getContractsMeta();
    return toGetContractsMetaResponseDto(entity);
  }
}
