import * as v from "valibot";

import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDecimals } from "@/shared/helpers/token-units.helper";
import { addressValidator } from "@/shared/validations/rules/address.validator";
import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { unsignedBigintFromStringValidator } from "@/shared/validations/rules/string-bigint.validator";
import { tokenWithSymbolValidator } from "@/shared/validations/rules/token.validator";

export const CreateQuoteDtoSchemaBase = v.object(
  {
    chain: chainValidator("chain"),
    sender: addressValidator("sender"),
    recipient: addressValidator("recipient"),
    token: tokenWithSymbolValidator("token"),
    feeToken: tokenWithSymbolValidator("feeToken"),
    amountMinUnits: unsignedBigintFromStringValidator("amountMinUnits")
  },
  issue => `${issue.expected} is required`
);
export type CreateQuoteDtoBase = v.InferOutput<typeof CreateQuoteDtoSchemaBase>;

export const CreateQuoteDtoSchema = v.pipe(
  CreateQuoteDtoSchemaBase,
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
