import { Controller, UseGuards, UseFilters, Post, Body, HttpCode } from "@nestjs/common";

import { QuotesService } from "@/application/services/quotes";
import { HttpExceptionsFilter } from "@/interfaces/common/filters/http-exception.filter";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";
import { ValibotPipe } from "@/interfaces/common/pipes/valibot.pipe";

import { CreateQuoteRequestDtoSchema, type CreateQuoteRequestDto, type CreateQuoteResponseDto } from "./quotes.dto";
import { toCreateQuoteResponseDto } from "./quotes.mapper";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  @Post("quotes")
  @HttpCode(201)
  async create(
    @Body(new ValibotPipe(CreateQuoteRequestDtoSchema)) dto: CreateQuoteRequestDto
  ): Promise<CreateQuoteResponseDto> {
    const entity = await this.quotes.createQuote({
      chainKey: dto.chain,
      sender: dto.sender,
      recipient: dto.recipient,
      tokenSymbol: dto.token.symbol,
      feeTokenSymbol: dto.feeToken.symbol,
      amountMinUnits: dto.amountMinUnits
    });

    return toCreateQuoteResponseDto(entity);
  }
}
