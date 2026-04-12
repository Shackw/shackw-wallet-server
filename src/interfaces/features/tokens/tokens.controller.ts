import { Controller, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { TokensService } from "@/application/services/tokens";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";
import { ValibotPipe } from "@/interfaces/common/pipes/valibot.pipe";

import {
  TransferTokenRequestDtoSchema,
  type TransferTokenRequestDto,
  type TransferTokenResponseDto
} from "./tokens.dto";
import { toTransferTokenResponseDto } from "./tokens.mapper";

@Controller()
@UseGuards(AppCheckGuard)
export class TokensController {
  constructor(private readonly tokens: TokensService) {}

  @Post("tokens\\:transfer")
  @UsePipes(new ValibotPipe(TransferTokenRequestDtoSchema))
  async transfer(@Body() dto: TransferTokenRequestDto): Promise<TransferTokenResponseDto> {
    const entity = await this.tokens.transferToken({
      chainKey: dto.chain,
      quoteToken: dto.quoteToken,
      authorization: dto.authorization
    });

    return toTransferTokenResponseDto(entity);
  }
}
