import { Controller, Get, UseFilters } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { MetaService } from "@/application/services/meta.service";

import {
  ChainMetaDto,
  ContractsMetaDto,
  FeeMetaDto,
  MetaSummaryDto,
  MinTransferMetaDto,
  TokenMetaDto
} from "../dto/meta.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";

@Controller("meta")
@UseFilters(HttpExceptionsFilter)
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get all metadata as a combined summary" })
  @ApiOkResponse({ type: MetaSummaryDto })
  summary(): MetaSummaryDto {
    return this.metaService.buildSummary();
  }

  @Get("chains")
  @ApiOperation({ summary: "Get supported chains and their metadata" })
  @ApiOkResponse({ type: [ChainMetaDto] })
  chains(): ChainMetaDto[] {
    return this.metaService.buildChains();
  }

  @Get("tokens")
  @ApiOperation({ summary: "Get supported tokens and their metadata" })
  @ApiOkResponse({ type: [TokenMetaDto] })
  tokens(): TokenMetaDto[] {
    return this.metaService.buildTokens();
  }

  @Get("fees")
  @ApiOperation({ summary: "Get fixed transaction fees per chain and token" })
  @ApiOkResponse({ type: [FeeMetaDto] })
  fees(): FeeMetaDto[] {
    return this.metaService.buildFees();
  }

  @Get("min-transfer")
  @ApiOperation({ summary: "Get minimum transferable amounts per chain and token" })
  @ApiOkResponse({ type: [MinTransferMetaDto] })
  minTransfer(): MinTransferMetaDto[] {
    return this.metaService.buildMinTransfers();
  }

  @Get("contracts")
  @ApiOperation({ summary: "Get contract addresses (Delegate / Registry / Sponsor)" })
  @ApiOkResponse({ type: ContractsMetaDto })
  contracts(): ContractsMetaDto {
    return this.metaService.buildContracts();
  }
}
