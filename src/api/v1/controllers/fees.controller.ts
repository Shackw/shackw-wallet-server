import { Body, Controller, Post, UseFilters, UsePipes } from "@nestjs/common";

import { HttpExceptionsFilter } from "@/shared/filters/http-exception.filter";
import { ValibotPipe } from "@/shared/pipes/valibot.pipe";

import { EstimateFeeDto, EstimateFeeDtoSchema } from "../dtos/fees.dto";
import { FeeModel } from "../models/fee.model";
import { FeesService } from "../services/fees.service";

@Controller("api/v1")
@UseFilters(HttpExceptionsFilter)
export class FeesController {
  constructor(private feesService: FeesService) {}

  @Post("fees\\:estimate")
  @UsePipes(new ValibotPipe(EstimateFeeDtoSchema))
  async estimate(@Body() body: EstimateFeeDto): Promise<FeeModel> {
    const result = await this.feesService.estimateFee(body);
    return result;
  }
}
