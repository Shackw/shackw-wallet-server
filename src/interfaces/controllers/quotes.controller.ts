import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";

import { QuotesService } from "@/application/services/quotes.service";
import { QuoteModel } from "@/domain/entities/quote.model";

import { CreateQuoteDtoSchema, CreateQuoteDto } from "../dto/quotes.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post("quotes")
  @UsePipes(new ValibotPipe(CreateQuoteDtoSchema))
  async estimate(@Body() body: CreateQuoteDto): Promise<QuoteModel> {
    const result = await this.quotesService.createQuote(body);
    return result;
  }
}
