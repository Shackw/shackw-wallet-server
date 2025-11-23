import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import * as v from "valibot";
import { Address, Hex } from "viem";

import { Chain, CHAIN_KEYS } from "@/config/chain.config";
import { TRANSACTION_DIRECTIONS, TransferDirection } from "@/domain/entities/transaction";
import { SUPPORT_CHAIN_TO_TOKEN, TOKENS } from "@/registries/token-chain.registry";
import {
  SearchTransferByChainSchemas,
  SEARCH_TRANSFER_DIRECTIONS,
  SearchTransactionDirection
} from "@/shared/validations/shapes/transaction-floor.shape";

import { AmountUnitsDto } from "./common/amount-unit.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";
import { TransactionCounterpartyDto } from "./common/transactiocounterparty.dto";

export const SearchTransactionsDtoSchema = v.variant("chain", Object.values(SearchTransferByChainSchemas), issue => {
  const input = issue.input as { chain?: string } | undefined;
  const chain = input?.chain;

  if (chain && (CHAIN_KEYS as readonly string[]).includes(chain)) {
    return `When chain is ${chain}, token.symbol must be one of: ${SUPPORT_CHAIN_TO_TOKEN[chain as Chain].join(", ")}.`;
  }

  return `token.symbol or chain is invalid. token.symbol must be one of: ${TOKENS.join(
    ", "
  )}, chain must be one of: ${CHAIN_KEYS.join(", ")}.`;
});

export type SearchTransactionsRequestDto = v.InferOutput<typeof SearchTransactionsDtoSchema>;

export class SearchTransactionsRequestDocDto {
  @ApiProperty({ enum: CHAIN_KEYS })
  chain!: Chain;

  @ApiProperty({ type: () => [TokenSymbolDto] })
  tokens!: TokenSymbolDto[];

  @ApiProperty({ example: "0x1234abcd..." })
  wallet!: Address;

  @ApiProperty({ example: 1732000000 })
  timestampGte!: number;

  @ApiProperty({ example: 1732600000 })
  timestampLte!: number;

  @ApiProperty({ example: 50 })
  limit?: number;

  @ApiProperty({ enum: SEARCH_TRANSFER_DIRECTIONS })
  direction!: SearchTransactionDirection;
}

export class SearchTransactionResponseDto {
  @ApiProperty({ example: "0x1234abcd..." })
  txHash!: Hex;

  @ApiProperty({ example: 30440835 })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  blockNumber!: string;

  @ApiProperty({ example: 14 })
  logIndex!: number;

  @Type(() => TokenInfoDto)
  @ApiProperty({ type: TokenInfoDto })
  token!: TokenInfoDto;

  @ApiProperty({ enum: TRANSACTION_DIRECTIONS })
  direction!: TransferDirection;

  @Type(() => AmountUnitsDto)
  @ApiProperty({ type: () => AmountUnitsDto })
  value!: AmountUnitsDto;

  @Type(() => TransactionCounterpartyDto)
  @ApiProperty({ type: () => TransactionCounterpartyDto })
  counterparty!: TransactionCounterpartyDto;

  @ApiProperty({ example: "2025-01-10T09:21:59.000Z" })
  @Transform(({ value }) => (value as Date).toISOString(), { toPlainOnly: true })
  transferredAt!: Date;
}
