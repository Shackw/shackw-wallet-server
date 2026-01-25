import { Body, Controller, Post, UseFilters, UseGuards, UsePipes } from "@nestjs/common";

import { TransactionsService } from "@/application/services/transactions";
import { TransactionEntity } from "@/domain/entities/transaction";

import { SearchTransactionsDtoSchema, SearchTransactionsRequestDto } from "../dto/transactions.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("transactions\\:search")
  @UsePipes(new ValibotPipe(SearchTransactionsDtoSchema))
  async searchTransactions(@Body() body: SearchTransactionsRequestDto): Promise<TransactionEntity[]> {
    return await this.transactionsService.searchTransactions(body);
  }
}
