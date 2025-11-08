import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsEnum, IsString } from "class-validator";
import { formatISO } from "date-fns";
import * as v from "valibot";
import { Address, Hex } from "viem";

import { SUPPORT_CHAIN_IDS, SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { SUPPORT_CHAIN_TO_TOKEN, TOKENS } from "@/registries/token-chain.registry";
import { TransferAddressValidator } from "@/shared/validations/shapes/transfer-address.shape";
import { TokenTransferFloorShape } from "@/shared/validations/shapes/transfer-floor.shape";

import { AmountUnitsDto } from "./common/amount-unit.dto";
import { FeePolicyDto } from "./common/fee-policy.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";

export const CreateQuoteRequestDtoSchema = v.intersect([
  v.variant(
    "token",
    [TokenTransferFloorShape.JPYC, TokenTransferFloorShape.USDC, TokenTransferFloorShape.EURC],
    issue => {
      const input = issue.input as string;
      if (SUPPORT_CHAIN_KEYS.includes(input as SupportChain))
        return `When chain is ${input}, token.symbol must be one of: ${SUPPORT_CHAIN_TO_TOKEN[input as SupportChain].join(", ")}.`;
      return `token.symbol or chain is invalid, token.symbol must be one of: ${TOKENS.join(", ")}, chain must be one of: ${SUPPORT_CHAIN_KEYS.join(", ")}.`;
    }
  ),
  TransferAddressValidator
]);
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
