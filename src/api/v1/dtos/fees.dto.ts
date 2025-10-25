import * as v from "valibot";

import { toDecimals } from "@/helpers/token-units.helper";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { chainValidator } from "@/validations/rules/chain.validator";
import { tokenValidator } from "@/validations/rules/token.validator";
import { unsignedBigintFromStringValidator } from "@/validations/rules/unsigned-bigint-from-string.validator";

export const EstimateFeeDtoSchema = v.pipe(
  v.object(
    {
      chain: chainValidator(),
      amountMinUnits: unsignedBigintFromStringValidator("amountMinUnits"),
      token: tokenValidator("token"),
      feeToken: tokenValidator("feeToken")
    },
    issue => `${issue.expected} is required`
  ),
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
