import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";

import { TransactionsService } from "@/application/services/transactions";

import {
  SearchTransactionsRequestDtoSchema,
  type SearchTransactionsRequestDto,
  type SearchTransactionsResponseDto
} from "../dto/transactions.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { AppCheckGuard } from "../guards/app-check.guard";
import { toSearchTransactionsResponseDto } from "../mappers/transaction.entity-to-response";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseGuards(AppCheckGuard)
@UseFilters(HttpExceptionsFilter)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("transactions\\:search")
  async searchTransactions(
    @Body(new ValibotPipe(SearchTransactionsRequestDtoSchema)) dto: SearchTransactionsRequestDto
  ): Promise<SearchTransactionsResponseDto[]> {
    const entities = await this.transactionsService.searchTransactions({
      chainKey: dto.chain,
      tokenSymbols: dto.tokens.map(token => token.symbol),
      walletAddress: dto.wallet,
      timestampGte: dto.timestampGte,
      timestampLte: dto.timestampLte,
      searchDirection: dto.direction,
      limit: dto.limit
    });

    return entities.map(toSearchTransactionsResponseDto);
  }
}
