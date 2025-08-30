import * as v from "valibot";

import { DEFAULT_CHAIN } from "@/configs/chain.config";
import { TOKEN_REGISTRY, TOKENS } from "@/registries/token.registry";
import { toDecimals } from "@/utils/token-units.util";

export const EstimateFeeDtoSchema = v.pipe(
  v.object({
    chainId: v.pipe(
      v.number("chainId must be a number."),
      v.literal(DEFAULT_CHAIN.id, `chainId must be ${DEFAULT_CHAIN.id}.`)
    ),
    amountMinUnits: v.pipe(
      v.string("amountMinUnits must be a string."),
      v.transform(s => s.trim()),
      v.minLength(1, "amountMinUnits must not be empty."),
      v.regex(/^\d+$/, "amountMinUnits must be an unsigned integer string (minimal units)."),
      v.transform(s => BigInt(s))
    ),
    token: v.object({
      symbol: v.pipe(
        v.string("token.symbol must be a string."),
        v.picklist(TOKENS, `token.symbol must be one of: ${TOKENS.join(", ")}.`)
      )
    }),
    feeToken: v.object({
      symbol: v.pipe(
        v.string("feeToken.symbol must be a string."),
        v.picklist(TOKENS, `token.symbol must be one of: ${TOKENS.join(", ")}.`)
      )
    })
  }),
  v.forward(
    v.check(
      dto => dto.amountMinUnits >= TOKEN_REGISTRY[dto.token.symbol].minTransferAmountUnits,
      issue => {
        const dto = issue.input as {
          amountMinUnits: bigint;
          token: { symbol: keyof typeof TOKEN_REGISTRY };
        };
        const { symbol } = dto.token;
        const { minTransferAmountUnits } = TOKEN_REGISTRY[symbol];
        const humanMin = toDecimals(minTransferAmountUnits, symbol);
        return `Minimum transferable amount for ${symbol} is ${humanMin} ${symbol} (${minTransferAmountUnits.toString()} minimal units).`;
      }
    ),
    ["amountMinUnits"]
  )
);
export type EstimateFeeDto = v.InferOutput<typeof EstimateFeeDtoSchema>;
