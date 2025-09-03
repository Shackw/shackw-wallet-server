import * as v from "valibot";

import { toDecimals } from "@/helpers/token-units.helper";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { addressValidator } from "@/validations/rules/address.validator";
import { chainIdValidator } from "@/validations/rules/chain-id.validator";
import { tokenValidator } from "@/validations/rules/token.validator";
import { unsignedBigintFromStringValidator } from "@/validations/rules/unsigned-bigint-from-string.validator";

export const CreateQuoteDtoSchema = v.pipe(
  v.object(
    {
      chainId: chainIdValidator(),
      sender: addressValidator("sender"),
      recipient: addressValidator("recipient"),
      token: tokenValidator("token"),
      feeToken: tokenValidator("feeToken"),
      amountMinUnits: unsignedBigintFromStringValidator("amountMinUnits")
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
export type CreateQuoteDto = v.InferOutput<typeof CreateQuoteDtoSchema>;
