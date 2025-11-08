import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import * as v from "valibot";
import { Hex } from "viem";

import { SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { chainValidator } from "@/shared/validations/rules/chain.validator";
import { AuthorizationShape } from "@/shared/validations/shapes/authorization.shape";
import { NotifyShape } from "@/shared/validations/shapes/notify.shape";
import { QuoteTokenShape } from "@/shared/validations/shapes/quote-token.shape";

import { AuthorizationDto } from "./common/authorization.dto";
import { NotifyDto } from "./common/notify.dto";

export const TransferTokenDtoSchema = v.object(
  {
    chain: chainValidator("chain"),
    quoteToken: QuoteTokenShape,
    authorization: AuthorizationShape,
    notify: v.optional(NotifyShape)
  },
  issue => `${issue.expected} is required`
);
export type TransferTokenRequestDto = v.InferOutput<typeof TransferTokenDtoSchema>;

export class TransferTokenRequestDocDto {
  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS })
  chain!: SupportChain;

  @ApiProperty({ example: "AAAAAAAAAAAAA..." })
  quoteToken!: string;

  @ApiProperty({ type: AuthorizationDto })
  authorization!: AuthorizationDto;

  @ApiProperty({ type: NotifyDto, required: false })
  notify?: NotifyDto;
}

export class TransferTokenResponceDto {
  @ApiProperty({
    example: "submitted"
  })
  method!: "submitted";

  @ApiProperty({ example: "0x1234abcd..." })
  txHash!: Hex;

  @Type(() => NotifyDto)
  @ApiProperty({ type: NotifyDto })
  notify?: NotifyDto;
}
