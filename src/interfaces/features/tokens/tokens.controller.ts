import { Controller, UseFilters, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { TokenService } from "@/application/services/tokens";
import { HttpExceptionsFilter } from "@/interfaces/common/filters/http-exception.filter";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";
import { ValibotPipe } from "@/interfaces/common/pipes/valibot.pipe";

import {
  TransferTokenRequestDtoSchema,
  type TransferTokenRequestDto,
  type TransferTokenResponseDto
} from "./tokens.dto";
import { toTransferTokenResponseDto } from "./tokens.entity-to-response";

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
