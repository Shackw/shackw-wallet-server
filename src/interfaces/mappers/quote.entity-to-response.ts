import * as v from "valibot";

import type { QuoteEntity } from "@/domain/entities/quote.entity";

import { CreateQuoteResponseDtoSchemas, type CreateQuoteResponseDto } from "../dto/quotes.dto";

export const toCreateQuoteResponseDto = (entity: QuoteEntity): CreateQuoteResponseDto => {
  return v.parse(CreateQuoteResponseDtoSchemas, entity);
};
