import { Controller, UseFilters, Post, UsePipes, Body, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { FeesService } from "@/application/services/fees.service";
import { FeeModel } from "@/domain/entities/fee.model";

import { EstimateFeeRequestDtoSchema, EstimateFeeRequestDto, FeeResponseDto } from "../dto/fees.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private feesService: FeesService) {}

  @Post("fees\\:estimate")
  @ApiOperation({ summary: "Estimate transaction fee" })
  @ApiResponse({ status: 200, type: FeeResponseDto, description: "Estimated fee data." })
  @UsePipes(
    new ValibotPipe(EstimateFeeRequestDtoSchema),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: false }
    })
  )
  async estimate(@Body() body: EstimateFeeRequestDto): Promise<FeeResponseDto> {
    const result: FeeModel = await this.feesService.estimateFee(body);

    return plainToInstance(FeeResponseDto, result, {
      enableImplicitConversion: true
    });
  }
}
