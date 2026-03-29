import { Controller, UseFilters, Post, Body, UseGuards } from "@nestjs/common";

import { FeesService } from "@/application/services/fees";
import { HttpExceptionsFilter } from "@/interfaces/common/filters/http-exception.filter";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";
import { ValibotPipe } from "@/interfaces/common/pipes/valibot.pipe";

import { EstimateFeeRequestDtoSchema, type EstimateFeeRequestDto, type EstimateFeeResponseDto } from "./fees.dto";
import { toEstimateFeeResponseDto } from "./fees.mapper";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private readonly fees: FeesService) {}

  @Post("fees\\:estimate")
  async estimate(
    @Body(new ValibotPipe(EstimateFeeRequestDtoSchema)) dto: EstimateFeeRequestDto
  ): Promise<EstimateFeeResponseDto> {
    const entity = await this.fees.estimateFee({
      chainKey: dto.chain,
      tokenSymbol: dto.token.symbol,
      feeTokenSymbol: dto.feeToken.symbol,
      amountMinUnits: dto.amountMinUnits
    });

    return toEstimateFeeResponseDto(entity);
  }
}
