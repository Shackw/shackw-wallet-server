import { Controller, UseFilters, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { FeesService } from "@/application/services/fees.service";
import { FeeEntity } from "@/domain/entities/fee.entity";

import { EstimateFeeRequestDtoSchema, EstimateFeeRequestDto } from "../dto/fees.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post("fees\\:estimate")
  @UsePipes(new ValibotPipe(EstimateFeeRequestDtoSchema))
  estimate(@Body() body: EstimateFeeRequestDto): FeeEntity {
    return this.feesService.estimateFee(body);
  }
}
