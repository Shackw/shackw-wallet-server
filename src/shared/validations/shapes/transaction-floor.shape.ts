import * as v from "valibot";

import { Chain } from "@/config/chain.config";
import { SUPPORT_CHAIN_TO_TOKEN, TokenByChain } from "@/registries/token-chain.registry";

import { addressValidator } from "../rules/address.validator";

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
  mainnet: buildSearchTransferSchema("mainnet", SUPPORT_CHAIN_TO_TOKEN.mainnet),
  base: buildSearchTransferSchema("base", SUPPORT_CHAIN_TO_TOKEN.base),
  polygon: buildSearchTransferSchema("polygon", SUPPORT_CHAIN_TO_TOKEN.polygon),
  sepolia: buildSearchTransferSchema("sepolia", SUPPORT_CHAIN_TO_TOKEN.sepolia),
  baseSepolia: buildSearchTransferSchema("baseSepolia", SUPPORT_CHAIN_TO_TOKEN.baseSepolia),
  polygonAmoy: buildSearchTransferSchema("polygonAmoy", SUPPORT_CHAIN_TO_TOKEN.polygonAmoy)
} as const satisfies Record<Chain, unknown>;
