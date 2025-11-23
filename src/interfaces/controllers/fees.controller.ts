import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { FeesService } from "@/application/services/fees.service";
import { FeeModel } from "@/domain/entities/fee.entity";

import {
  EstimateFeeRequestDtoSchema,
  EstimateFeeRequestDto,
  EstimateFeeRequestDocDto,
  EstimateFeeResponseDto
} from "../dto/fees.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post("fees\\:estimate")
  @ApiOperation({ summary: "Estimate transaction fee" })
  @ApiBody({ type: EstimateFeeRequestDocDto })
  @ApiResponse({ status: 200, type: EstimateFeeResponseDto, description: "Estimated fee data." })
  @UsePipes(new ValibotPipe(EstimateFeeRequestDtoSchema))
  estimate(@Body() body: EstimateFeeRequestDto): EstimateFeeResponseDto {
    const result: FeeModel = this.feesService.estimateFee(body);

    return plainToInstance(EstimateFeeResponseDto, result, {
      enableImplicitConversion: true
    });
  }
}
