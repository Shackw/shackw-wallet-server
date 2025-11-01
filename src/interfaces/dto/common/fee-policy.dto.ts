import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { FeeCapDto } from "./fee-cap.dto";

export class FeePolicyDto {
  @ApiProperty({
    example: "bps_with_cap",
    description: "Fee calculation method (basis points with cap)."
  })
  method!: "bps_with_cap";

  @ApiProperty({ example: "v1" })
  version!: "v1";

  @ApiProperty({
    example: 100
  })
  bps!: number;

  @Type(() => FeeCapDto)
  cap!: FeeCapDto;
}
