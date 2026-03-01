import { Controller, UseFilters, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { TokenService } from "@/application/services/tokens";

import {
  TransferTokenRequestDtoSchema,
  type TransferTokenRequestDto,
  type TransferTokenResponseDto
} from "../dto/token.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { toTransferTokenResponseDto } from "../mappers/token.entity-to-response";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class TokensController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("tokens\\:transfer")
  @UsePipes(new ValibotPipe(TransferTokenRequestDtoSchema))
  async transfer(@Body() dto: TransferTokenRequestDto): Promise<TransferTokenResponseDto> {
    const entity = await this.tokenService.transferToken({
      chainKey: dto.chain,
      quoteToken: dto.quoteToken,
      authorization: dto.authorization,
      notify: dto.notify
    });

    return toTransferTokenResponseDto(entity);
  }
}
