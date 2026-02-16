import * as v from "valibot";

import type { TokenByChain } from "@/config/chain-token.config";
import { CHAIN_TO_TOKEN } from "@/config/chain-token.config";
import type { Chain } from "@/config/chain.config";

import { addressValidator } from "../../../shared/validations/rules/address.validator";

export const SEARCH_TRANSFER_DIRECTIONS = ["in", "out", "both"] as const;
export type SearchTransactionDirection = (typeof SEARCH_TRANSFER_DIRECTIONS)[number];

const buildSearchTransferSchema = <C extends Chain, T extends TokenByChain<C>>(chain: C, tokens: readonly T[]) =>
  v.pipe(
    v.object(
      {
        chain: v.literal(chain),
        tokens: v.array(
          v.object({
            symbol: v.picklist(tokens)
          }),
          "tokens must be an array"
        ),
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

export const SearchTransferByChainSchemas = {
  mainnet: buildSearchTransferSchema("mainnet", CHAIN_TO_TOKEN.mainnet),
  base: buildSearchTransferSchema("base", CHAIN_TO_TOKEN.base),
  polygon: buildSearchTransferSchema("polygon", CHAIN_TO_TOKEN.polygon),
  sepolia: buildSearchTransferSchema("sepolia", CHAIN_TO_TOKEN.sepolia),
  baseSepolia: buildSearchTransferSchema("baseSepolia", CHAIN_TO_TOKEN.baseSepolia),
  polygonAmoy: buildSearchTransferSchema("polygonAmoy", CHAIN_TO_TOKEN.polygonAmoy)
} as const satisfies Record<Chain, unknown>;
