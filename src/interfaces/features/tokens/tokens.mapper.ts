import * as v from "valibot";

import type { TransferTokenEntity } from "@/domain/entities/token.entity";

import { TransferTokenResponseDtoSchema, type TransferTokenResponseDto } from "./tokens.dto";

export const toTransferTokenResponseDto = (entity: TransferTokenEntity): TransferTokenResponseDto => {
  return v.parse(TransferTokenResponseDtoSchema, entity);
};
