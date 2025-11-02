import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import * as v from "valibot";

import { SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDisplayValue } from "@/shared/helpers/token-units.helper";
import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { bigintStringValidator } from "@/shared/validations/rules/string-bigint.validator";
import { tokenWithSymbolValidator } from "@/shared/validations/rules/token.validator";

import { AmountUnitsDto } from "./common/amount-unit.dto";
import { FeePolicyDto } from "./common/fee-policy.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";

export const EstimateFeeRequestDtoSchema = v.pipe(
  v.object(
    {
      chain: chainValidator("chain"),
      amountMinUnits: bigintStringValidator("amountMinUnits"),
      token: tokenWithSymbolValidator("token"),
      feeToken: tokenWithSymbolValidator("feeToken")
    },
    issue => `${issue.expected} is required`
  ),
  v.forward(
    v.check(
      dto => BigInt(dto.amountMinUnits) >= TOKEN_REGISTRY[dto.token.symbol].minTransferAmountUnits,
      issue => {
        const dto = issue.input;
        const { symbol } = dto.token;
        const { minTransferAmountUnits } = TOKEN_REGISTRY[symbol];
        const displayValue = toDisplayValue(minTransferAmountUnits, symbol);
        return `Minimum transferable amount for ${symbol} is ${displayValue} ${symbol} (${minTransferAmountUnits.toString()} minimal units).`;
      }
    ),
    ["amountMinUnits"]
  )
);
export type EstimateFeeRequestDto = v.InferOutput<typeof EstimateFeeRequestDtoSchema>;

export class EstimateFeeRequestDocDto {
  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS })
  chain!: SupportChain;

  @ApiProperty({ example: "1000000" })
  amountMinUnits!: string;

  @ApiProperty({ type: () => TokenSymbolDto })
  token!: TokenSymbolDto;

  @ApiProperty({ type: () => TokenSymbolDto })
  feeToken!: TokenSymbolDto;
}

export class EstimateFeeResponseDto {
  @Type(() => TokenInfoDto)
  @ApiProperty({ type: TokenInfoDto })
  token!: TokenInfoDto;

  @Type(() => TokenInfoDto)
  @ApiProperty({ type: TokenInfoDto })
  feeToken!: TokenInfoDto;

  @Type(() => AmountUnitsDto)
  @ApiProperty({ type: AmountUnitsDto })
  amount!: AmountUnitsDto;

  @Type(() => AmountUnitsDto)
  @ApiProperty({ type: AmountUnitsDto })
  fee!: AmountUnitsDto;

  @Type(() => FeePolicyDto)
  @ApiProperty({ type: FeePolicyDto })
  policy!: FeePolicyDto;
}
