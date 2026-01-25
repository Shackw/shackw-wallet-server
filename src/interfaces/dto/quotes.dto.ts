import * as v from "valibot";

import type { Chain } from "@/config/chain.config";
import { CHAIN_KEYS } from "@/config/chain.config";
import { SUPPORT_CHAIN_TO_TOKEN, TOKENS } from "@/registries/token-chain.registry";
import { TransferAddressValidator } from "@/shared/validations/shapes/transfer-address.shape";
import { TokenTransferFloorShape } from "@/shared/validations/shapes/transfer-floor.shape";

export const CreateQuoteRequestDtoSchema = v.intersect([
  v.variant(
    "token",
    [TokenTransferFloorShape.JPYC, TokenTransferFloorShape.USDC, TokenTransferFloorShape.EURC],
    issue => {
      const input = issue.input as string;
      if (CHAIN_KEYS.includes(input as Chain))
        return `When chain is ${input}, token.symbol must be one of: ${SUPPORT_CHAIN_TO_TOKEN[input as Chain].join(", ")}.`;
      return `token.symbol or chain is invalid, token.symbol must be one of: ${TOKENS.join(", ")}, chain must be one of: ${CHAIN_KEYS.join(", ")}.`;
    }
  ),
  TransferAddressValidator
]);
export type CreateQuoteRequestDto = v.InferOutput<typeof CreateQuoteRequestDtoSchema>;
