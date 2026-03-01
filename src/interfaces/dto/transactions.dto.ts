import * as v from "valibot";

import { CHAIN_KEYS } from "@/config/chain.config";
import { TOKENS } from "@/config/token.config";
import { TRANSACTION_DIRECTIONS } from "@/domain/entities/transaction";
import { addressValidator, hex64Validator } from "@/shared/validations/rules/address.validator";

import { TokenAmountShape } from "./shapes/token-amount.shape";
import { TokenDescriptorShape } from "./shapes/token-descriptor.shape";

// === Request Schemas ====
const SEARCH_TRANSFER_DIRECTIONS = ["in", "out", "both"] as const;
export const SearchTransactionsRequestDtoSchema = v.pipe(
  v.object(
    {
      chain: v.picklist(CHAIN_KEYS, `chain must be one of ${CHAIN_KEYS.join("/")}`),
      tokens: v.array(v.object({ symbol: v.picklist(TOKENS, `token must be one of ${TOKENS.join("/")}`) })),
      wallet: addressValidator("wallet"),
      timestampGte: v.pipe(
        v.number("timestampGte must be a number"),
        v.minValue(1_000_000_000, "timestampGte must be a valid Unix timestamp (10 digits)")
      ),
      timestampLte: v.pipe(
        v.number("timestampLte must be a number"),
        v.minValue(1_000_000_000, "timestampLte must be a valid Unix timestamp (10 digits)")
      ),
      limit: v.optional(v.number("limit must be a number")),
      direction: v.picklist(
        SEARCH_TRANSFER_DIRECTIONS,
        `direction must be one of ${SEARCH_TRANSFER_DIRECTIONS.join(", ")}`
      )
    },
    issue => `${issue.expected} is required`
  ),
  v.forward(
    v.check(
      dto => dto.timestampLte >= dto.timestampGte,
      issue => {
        const { timestampGte, timestampLte } = issue.input;
        return `timestampLte must be greater than or equal to timestampGte (got ${timestampGte} ~ ${timestampLte}).`;
      }
    ),
    ["timestampLte"]
  )
);

// === Response Schemas ====
export const SearchTransactionsResponseDtoSchema = v.object({
  txHash: hex64Validator("txHash"),
  blockNumber: v.bigint(),
  logIndex: v.number(),
  token: TokenDescriptorShape,
  direction: v.picklist(TRANSACTION_DIRECTIONS),
  value: TokenAmountShape,
  counterparty: v.object({
    address: addressValidator("counterparty.address")
  }),
  transferredAt: v.date()
});

// === Request DTOs ====
export type SearchTransactionsRequestDto = v.InferOutput<typeof SearchTransactionsRequestDtoSchema>;

// === Response DTOs ====
export type SearchTransactionsResponseDto = v.InferOutput<typeof SearchTransactionsResponseDtoSchema>;
