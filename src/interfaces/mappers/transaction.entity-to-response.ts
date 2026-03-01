import * as v from "valibot";

import type { TransactionEntity } from "@/domain/entities/transaction";

import { SearchTransactionsResponseDtoSchema, type SearchTransactionsResponseDto } from "../dto/transactions.dto";

export const toSearchTransactionsResponseDto = (entity: TransactionEntity): SearchTransactionsResponseDto => {
  return v.parse(SearchTransactionsResponseDtoSchema, entity);
};
