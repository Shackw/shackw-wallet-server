import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { CURRENCIES, Currency } from "@/registries/token.registry";

export class FeeCapDto {
  @ApiProperty({
    example: "1000000000000000000"
  })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  minUnit!: string;

  @ApiProperty({ enum: CURRENCIES })
  currency!: Currency;
}
