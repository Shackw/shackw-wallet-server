import { Controller, Get, UseFilters } from "@nestjs/common";

import { MetaService } from "@/application/services/meta.service";
import type {
  MetaSummaryEntity,
  ChainMetaEntity,
  TokenMetaEntity,
  FeeMetaEntity,
  MinTransferMetaEntity,
  ContractsMetaEntity
} from "@/domain/entities/meta.entity";

import { HttpExceptionsFilter } from "../filters/http-exception.filter";

@Controller("meta")
@UseFilters(HttpExceptionsFilter)
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get("summary")
  summary(): MetaSummaryEntity {
    return this.metaService.buildSummary();
  }

  @Get("chains")
  chains(): ChainMetaEntity[] {
    return this.metaService.buildChains();
  }

  @Get("tokens")
  tokens(): TokenMetaEntity[] {
    return this.metaService.buildTokens();
  }

  @Get("fees")
  fees(): FeeMetaEntity[] {
    return this.metaService.buildFees();
  }

  @Get("min-transfers")
  minTransfer(): MinTransferMetaEntity[] {
    return this.metaService.buildMinTransfers();
  }

  @Get("contracts")
  contracts(): ContractsMetaEntity {
    return this.metaService.buildContracts();
  }
}
