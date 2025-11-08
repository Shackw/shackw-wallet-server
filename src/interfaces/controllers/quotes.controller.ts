import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { QuotesService } from "@/application/services/quotes.service";
import { QuoteModel } from "@/domain/entities/quote.entity";

import {
  CreateQuoteRequestDtoSchema,
  CreateQuoteRequestDto,
  CreateQuoteRequestDocDto,
  CreateQuoteResponseDto
} from "../dto/quotes.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post("quotes")
  @ApiOperation({ summary: "Create a payment quote" })
  @ApiBody({ type: CreateQuoteRequestDocDto })
  @ApiResponse({ status: 201, type: CreateQuoteResponseDto, description: "Created quote." })
  @UsePipes(new ValibotPipe(CreateQuoteRequestDtoSchema))
  async create(@Body() body: CreateQuoteRequestDto): Promise<CreateQuoteResponseDto> {
    const result: QuoteModel = await this.quotesService.createQuote(body);

    return plainToInstance(CreateQuoteResponseDto, result, {
      enableImplicitConversion: true
    });
  }
}
