import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

import { AmountUnitsDto } from "./amount-unit.dto";

export class FeePolicyDto {
  @ApiProperty({
    example: "bps_with_cap"
  })
  method!: "bps_with_cap";

  @ApiProperty({ example: "v1" })
  version!: "v1";

  @ApiProperty({
    example: "100"
  })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  bps!: string;

  @Type(() => AmountUnitsDto)
  @ApiProperty({ type: AmountUnitsDto })
  cap!: AmountUnitsDto;

  @ApiProperty({
    example: "10000000000000000"
  })
  @Transform(({ value }) => (value as bigint).toString(), { toPlainOnly: true })
  quantumUnits!: string;
}
