import * as v from "valibot";

import type { TransactionEntity } from "@/domain/entities/transaction.entity";

import { SearchTransactionsResponseDtoSchema, type SearchTransactionsResponseDto } from "./transactions.dto";

export const toSearchTransactionsResponseDto = (entity: TransactionEntity): SearchTransactionsResponseDto => {
  return v.parse(SearchTransactionsResponseDtoSchema, entity);
};
