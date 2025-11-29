import { Body, Controller, Post, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

import { TransactionsService } from "@/application/services/transactions";
import { TransactionModel } from "@/domain/entities/transaction";

import {
  SearchTransactionResponseDto,
  SearchTransactionsDtoSchema,
  SearchTransactionsRequestDocDto,
  SearchTransactionsRequestDto
} from "../dto/transactions.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("transactions\\:search")
  @ApiOperation({ summary: "Search token transactions" })
  @ApiBody({ type: SearchTransactionsRequestDocDto })
  @ApiResponse({
    status: 200,
    type: SearchTransactionResponseDto,
    isArray: true,
    description: "Transactions successfully fetched."
  })
  @UsePipes(new ValibotPipe(SearchTransactionsDtoSchema))
  async searchTransactions(@Body() body: SearchTransactionsRequestDto): Promise<SearchTransactionResponseDto[]> {
    const result: TransactionModel[] = await this.transactionsService.searchTransactions(body);

    return plainToInstance(SearchTransactionResponseDto, result, {
      enableImplicitConversion: true
    });
  }
}
