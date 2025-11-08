import { Controller, Get, UseFilters } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { MetaService } from "@/application/services/meta.service";

import { ContractsDto, FeeItemDto, MetaSummaryDto, MinTransferItemDto, TokenAddressDto } from "../dto/meta.dto";
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

  @Get("tokens")
  @ApiOperation({ summary: "Get supported tokens and their metadata" })
  @ApiOkResponse({ type: [TokenAddressDto] })
  tokens(): TokenAddressDto[] {
    return this.metaService.buildTokens();
  }

  @Get("fees")
  @ApiOperation({ summary: "Get fixed transaction fees per chain and token" })
  @ApiOkResponse({ type: [FeeItemDto] })
  fees(): FeeItemDto[] {
    return this.metaService.buildFees();
  }

  @Get("min-transfer")
  @ApiOperation({ summary: "Get minimum transferable amounts per chain and token" })
  @ApiOkResponse({ type: [MinTransferItemDto] })
  minTransfer(): MinTransferItemDto[] {
    return this.metaService.buildMinTransfers();
  }

  @Get("contracts")
  @ApiOperation({ summary: "Get contract addresses (Delegate / Registry / Sponsor)" })
  @ApiOkResponse({ type: ContractsDto })
  contracts(): ContractsDto {
    return this.metaService.buildContracts();
  }
}
