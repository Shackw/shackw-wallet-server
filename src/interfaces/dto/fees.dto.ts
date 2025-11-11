import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import * as v from "valibot";

import { CHAIN_KEYS, Chain } from "@/config/chain.config";
import { SUPPORT_CHAIN_TO_TOKEN, TOKENS } from "@/registries/token-chain.registry";
import { TokenTransferFloorShape } from "@/shared/validations/shapes/transfer-floor.shape";

import { AmountUnitsDto } from "./common/amount-unit.dto";
import { FeePolicyDto } from "./common/fee-policy.dto";
import { TokenInfoDto } from "./common/token-info.dto";
import { TokenSymbolDto } from "./common/token-symbol.dto";

export const EstimateFeeRequestDtoSchema = v.variant(
  "token",
  [TokenTransferFloorShape.JPYC, TokenTransferFloorShape.USDC, TokenTransferFloorShape.EURC],
  issue => {
    const input = issue.input as string;
    if (CHAIN_KEYS.includes(input as Chain))
      return `When chain is ${input}, token.symbol must be one of: ${SUPPORT_CHAIN_TO_TOKEN[input as Chain].join(", ")}.`;
    return `token.symbol or chain is invalid, token.symbol must be one of: ${TOKENS.join(", ")}, chain must be one of: ${CHAIN_KEYS.join(", ")}.`;
  }
);
export type EstimateFeeRequestDto = v.InferOutput<typeof EstimateFeeRequestDtoSchema>;

export class EstimateFeeRequestDocDto {
  @ApiProperty({ enum: CHAIN_KEYS })
  chain!: Chain;

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
