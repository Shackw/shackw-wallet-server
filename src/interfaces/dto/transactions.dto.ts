import * as v from "valibot";

import type { Chain } from "@/config/chain.config";
import { CHAIN_KEYS } from "@/config/chain.config";
import { SUPPORT_CHAIN_TO_TOKEN, TOKENS } from "@/registries/token-chain.registry";
import { SearchTransferByChainSchemas } from "@/shared/validations/shapes/transaction-floor.shape";

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
