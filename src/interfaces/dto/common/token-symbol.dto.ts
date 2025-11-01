import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { TOKENS, Token } from "@/registries/token.registry";

export class TokenSymbolDto {
  @ApiProperty({ enum: TOKENS })
  @IsEnum(TOKENS)
  symbol!: Token;
}
