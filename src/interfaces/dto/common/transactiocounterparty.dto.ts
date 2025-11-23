import { ApiProperty } from "@nestjs/swagger";
import { Address } from "viem";

export class TransactionCounterpartyDto {
  @ApiProperty({ example: "0x1234abcd..." })
  address!: Address;
}
