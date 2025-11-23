import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";
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
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post("transactions\\:search")
  @ApiOperation({ summary: "Execute token transfer" })
  @ApiBody({ type: SearchTransactionsRequestDocDto })
  @ApiResponse({ status: 200, type: [SearchTransactionResponseDto], description: "Transfer successfully executed." })
  @UsePipes(new ValibotPipe(SearchTransactionsDtoSchema))
  async createTransfer(@Body() body: SearchTransactionsRequestDto): Promise<SearchTransactionResponseDto[]> {
    const result: TransactionModel[] = await this.transactionsService.searchTransactions(body);

    return plainToInstance(SearchTransactionResponseDto, result, {
      enableImplicitConversion: true
    });
  }
}
