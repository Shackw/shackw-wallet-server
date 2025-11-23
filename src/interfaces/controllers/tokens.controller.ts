import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { TokenService } from "@/application/services/token.service";
import { TransferTokenModel } from "@/domain/entities/token.entity";

import {
  TransferTokenDtoSchema,
  TransferTokenRequestDto,
  TransferTokenRequestDocDto,
  TransferTokenResponceDto
} from "../dto/token.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class TokensController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("tokens\\:transfer")
  @ApiOperation({ summary: "Execute token transfer" })
  @ApiBody({ type: TransferTokenRequestDocDto })
  @ApiResponse({ status: 201, type: TransferTokenResponceDto, description: "Transfer successfully executed." })
  @UsePipes(new ValibotPipe(TransferTokenDtoSchema))
  async transfer(@Body() body: TransferTokenRequestDto): Promise<TransferTokenResponceDto> {
    const result: TransferTokenModel = await this.tokenService.transferToken(body);

    return plainToInstance(TransferTokenResponceDto, result, {
      enableImplicitConversion: true
    });
  }
}
