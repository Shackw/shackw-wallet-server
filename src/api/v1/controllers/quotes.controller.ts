import { Body, Controller, Post, UseFilters, UsePipes } from "@nestjs/common";

import { HttpExceptionsFilter } from "@/shared/filters/http-exception.filter";
import { ValibotPipe } from "@/shared/pipes/valibot.pipe";

import { CreateQuoteDto, CreateQuoteDtoSchema } from "../dtos/quotes.dto";
import { QuotesService } from "../services/quotes.service";

@Controller("api/v1")
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post("quotes")
  @UsePipes(new ValibotPipe(CreateQuoteDtoSchema))
  async estimate(@Body() body: CreateQuoteDto) {
    const quote = await this.quotesService.createQuote(body);
    return quote;
  }
}
