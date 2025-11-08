import { ApiProperty } from "@nestjs/swagger";

import { TOKENS, Token } from "@/registries/token-chain.registry";

export class TokenSymbolDto {
  @ApiProperty({ enum: TOKENS })
  symbol!: Token;
}
