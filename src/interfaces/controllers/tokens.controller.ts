import { Controller, UseFilters, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { TokenService } from "@/application/services/token.service";
import { TransferTokenEntity } from "@/domain/entities/token.entity";

import { TransferTokenDtoSchema, TransferTokenRequestDto } from "../dto/token.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class TokensController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("tokens\\:transfer")
  @UsePipes(new ValibotPipe(TransferTokenDtoSchema))
  async transfer(@Body() body: TransferTokenRequestDto): Promise<TransferTokenEntity> {
    return await this.tokenService.transferToken(body);
  }
}
