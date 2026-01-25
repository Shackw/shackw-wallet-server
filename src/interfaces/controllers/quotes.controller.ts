import { Controller, UseFilters, Post, UsePipes, Body, UseGuards } from "@nestjs/common";

import { QuotesService } from "@/application/services/quotes.service";
import { QuoteEntity } from "@/domain/entities/quote.entity";

import { CreateQuoteRequestDtoSchema, CreateQuoteRequestDto } from "../dto/quotes.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post("quotes")
  @UsePipes(new ValibotPipe(CreateQuoteRequestDtoSchema))
  async create(@Body() body: CreateQuoteRequestDto): Promise<QuoteEntity> {
    return await this.quotesService.createQuote(body);
  }
}
