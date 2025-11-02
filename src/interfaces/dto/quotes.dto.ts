import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsEnum, IsString } from "class-validator";
import { formatISO } from "date-fns";
import * as v from "valibot";
import { Address, Hex } from "viem";

import { SUPPORT_CHAIN_IDS, SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { TOKEN_REGISTRY } from "@/registries/token.registry";
import { toDisplayValue } from "@/shared/helpers/token-units.helper";
import { addressValidator } from "@/shared/validations/rules/address.validator";
import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { bigintStringValidator } from "@/shared/validations/rules/string-bigint.validator";
import { tokenWithSymbolValidator } from "@/shared/validations/rules/token.validator";

import { AmountUnitsDto } from "./common/amount-unit.dto";
import { FeePolicyDto } from "./common/fee-policy.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";

export const CreateQuoteRequestDtoSchema = v.pipe(
  v.object(
    {
      chain: chainValidator("chain"),
      sender: addressValidator("sender"),
      recipient: addressValidator("recipient"),
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
export type CreateQuoteRequestDto = v.InferOutput<typeof CreateQuoteRequestDtoSchema>;

export class CreateQuoteRequestDocDto {
  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS })
  chain!: SupportChain;

  @ApiProperty({ example: "0x1234abcd..." })
  sender!: Address;

  @ApiProperty({ example: "0x1234abcd..." })
  recipient!: Address;

  @ApiProperty({ example: "1000000" })
  amountMinUnits!: string;

  @ApiProperty({ type: () => TokenSymbolDto })
  token!: TokenSymbolDto;

  @ApiProperty({ type: () => TokenSymbolDto })
  feeToken!: TokenSymbolDto;
}

export class CreateQuoteResponseDto {
  @ApiProperty({ example: "AAAAAAAAAAAAA..." })
  @IsString()
  quoteToken!: string;

  @ApiProperty({ example: "2025-11-01T13:50:47.493Z" })
  @Transform(({ value }) => formatISO(value as Date), { toPlainOnly: true })
  expiresAt!: Date;

  @ApiProperty({ example: 8453, enum: SUPPORT_CHAIN_IDS })
  @IsEnum(SUPPORT_CHAIN_IDS)
  chainId!: number;

  @ApiProperty({ example: "0x1234abcd..." })
  sender!: Address;

  @ApiProperty({ example: "0x1234abcd..." })
  recipient!: Address;

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

  @ApiProperty({ example: "0x1234abcd..." })
  delegate!: Address;

  @ApiProperty({ example: "0x1234abcd..." })
  sponsor!: Address;

  @ApiProperty({ example: "0x1234abcd..." })
  callHash!: Hex;

  @Type(() => FeePolicyDto)
  @ApiProperty({ type: FeePolicyDto })
  policy!: FeePolicyDto;
}
