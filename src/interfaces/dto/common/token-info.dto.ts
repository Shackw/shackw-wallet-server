import { ApiProperty } from "@nestjs/swagger";
import { Address } from "viem";

import { TOKENS, Token } from "@/registries/token-chain.registry";

export class TokenInfoDto {
  @ApiProperty({ enum: TOKENS })
  symbol!: Token;

  @ApiProperty({ example: "0x1234abcd..." })
  address!: Address;

  @ApiProperty({ example: 18 })
  decimals!: number;
}
