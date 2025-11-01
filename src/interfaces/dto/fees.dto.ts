import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDefined, IsEnum, ValidateNested } from "class-validator";
import * as v from "valibot";

import { SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDecimals } from "@/shared/helpers/token-units.helper";
import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { bigintStringValidator } from "@/shared/validations/rules/string-bigint.validator";
import { tokenWithSymbolValidator } from "@/shared/validations/rules/token.validator";

import { FeePolicyDto } from "./common/fee-policy.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";

export const EstimateFeeRequestDtoSchema = v.pipe(
  v.object(
    {
      chain: chainValidator(),
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
        const humanMin = toDecimals(minTransferAmountUnits, symbol);
        return `Minimum transferable amount for ${symbol} is ${humanMin} ${symbol} (${minTransferAmountUnits.toString()} minimal units).`;
      }
    ),
    ["amountMinUnits"]
  )
);

export class EstimateFeeRequestDto {
  @ApiProperty({
    enum: SUPPORT_CHAIN_KEYS
  })
  @IsEnum(SUPPORT_CHAIN_KEYS)
  chain!: SupportChain;

  @ApiProperty({
    type: String,
    example: "1000000"
  })
  @IsDefined()
  @Transform(({ value }) => BigInt(value as string), { toClassOnly: true })
  amountMinUnits!: bigint;

  @ApiProperty({ type: () => TokenSymbolDto })
  @ValidateNested()
  @Type(() => TokenSymbolDto)
  token!: TokenSymbolDto;

  @ApiProperty({ type: () => TokenSymbolDto })
  @ValidateNested()
  @Type(() => TokenSymbolDto)
  feeToken!: TokenSymbolDto;
}

export class FeeResponseDto {
  @Type(() => TokenInfoDto)
  @ApiProperty({ type: TokenInfoDto })
  token!: TokenInfoDto;

  @Type(() => TokenInfoDto)
  @ApiProperty({ type: TokenInfoDto })
  feeToken!: TokenInfoDto;

  @ApiProperty({ example: "1000000000000000000" })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  feeMinUnits!: string;

  @ApiProperty({ example: 18 })
  feeDecimals!: number;

  @Type(() => FeePolicyDto)
  @ApiProperty({ type: FeePolicyDto })
  policy!: FeePolicyDto;
}
