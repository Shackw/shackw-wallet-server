import { Controller, UseFilters, Post, Body, UseGuards } from "@nestjs/common";

import { QuotesService } from "@/application/services/quotes";

import {
  CreateQuoteRequestDtoSchema,
  type CreateQuoteRequestDto,
  type CreateQuoteResponseDto
} from "../dto/quotes.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { toCreateQuoteResponseDto } from "../mappers/quote.entity-to-response";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post("quotes")
  async create(
    @Body(new ValibotPipe(CreateQuoteRequestDtoSchema)) dto: CreateQuoteRequestDto
  ): Promise<CreateQuoteResponseDto> {
    const entity = await this.quotesService.createQuote({
      chainKey: dto.chain,
      sender: dto.sender,
      recipient: dto.recipient,
      tokenSymbol: dto.token.symbol,
      feeTokenSymbol: dto.token.symbol,
      amountMinUnits: dto.amountMinUnits
    });

    return toCreateQuoteResponseDto(entity);
  }
}
