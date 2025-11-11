import { Address } from "cluster";

import { ApiProperty } from "@nestjs/swagger";

import { CHAIN_IDS } from "@/config/chain.config";

export class AuthorizationDto {
  @ApiProperty({ example: "0x1234abcd..." })
  address!: Address;

  @ApiProperty({ example: 8453, enum: CHAIN_IDS })
  chainId!: number;

  @ApiProperty({ example: 3 })
  nonce!: number;

  @ApiProperty({ example: "0x1234abcd..." })
  r!: Address;

  @ApiProperty({ example: "0x1234abcd..." })
  s!: Address;

  @ApiProperty({ example: "27", required: false })
  v?: string;

  @ApiProperty({ example: 1, required: false, enum: [0, 1] })
  yParity?: 0 | 1;
}
