import { ApiProperty } from "@nestjs/swagger";

import { CHAIN_KEYS, Chain } from "@/config/chain.config";

export class FeePolicyDto {
  @ApiProperty({
    example: "fixed_by_chain"
  })
  method!: "fixed_by_chain";

  @ApiProperty({ example: "v1" })
  version!: "v1";

  @ApiProperty({ enum: CHAIN_KEYS })
  chain!: Chain;
}
