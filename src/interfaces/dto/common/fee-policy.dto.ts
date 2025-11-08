import { ApiProperty } from "@nestjs/swagger";

import { SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";

export class FeePolicyDto {
  @ApiProperty({
    example: "fixed_by_chain"
  })
  method!: "fixed_by_chain";

  @ApiProperty({ example: "v1" })
  version!: "v1";

  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS })
  chain!: SupportChain;
}
