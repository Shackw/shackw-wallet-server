import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { Token, TOKENS } from "@/registries/token.registry";

export class AmountUnitsDto {
  @ApiProperty({ enum: TOKENS })
  symbol!: Token;

  @ApiProperty({
    example: "1000000000000000000"
  })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  minUnits!: string;

  @ApiProperty({ example: 18 })
  decimals!: number;
}
