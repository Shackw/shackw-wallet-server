import { Controller, UseFilters, Post, Body, UseGuards } from "@nestjs/common";

import { FeesService } from "@/application/services/fees";

import { EstimateFeeRequestDtoSchema, EstimateFeeRequestDto, EstimateFeeResponseDto } from "../dto/fees.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { toEstimateFeeResponseDto } from "../mappers/fee.entity-to-response";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post("fees\\:estimate")
  estimate(@Body(new ValibotPipe(EstimateFeeRequestDtoSchema)) dto: EstimateFeeRequestDto): EstimateFeeResponseDto {
    const entity = this.feesService.estimateFee({
      chainKey: dto.chain,
      tokenSymbol: dto.token.symbol,
      feeTokenSymbol: dto.feeToken.symbol,
      amountMinUnits: dto.amountMinUnits
    });

    return toEstimateFeeResponseDto(entity);
  }
}
