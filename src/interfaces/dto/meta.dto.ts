import { ApiProperty } from "@nestjs/swagger";

import { SUPPORT_CHAIN_KEYS, SupportChain } from "@/config/chain.config";
import { Token, TOKENS } from "@/registries/token-chain.registry";

export class TokenAddressDto {
  @ApiProperty({ example: "JPYC" }) symbol!: Token;
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd..." } })
  address!: Record<string, string>;
  @ApiProperty({ example: 18 }) decimals!: number;
}

export class FeeItemDto {
  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS }) chain!: SupportChain;
  @ApiProperty({ example: TOKENS }) symbol!: Token;
  @ApiProperty({ example: "50000000000000000" })
  fixedFeeAmountUnits!: string;
  @ApiProperty({ example: 0.05 }) fixedFeeAmountDisplay!: number;
}

export class MinTransferItemDto {
  @ApiProperty({ enum: SUPPORT_CHAIN_KEYS }) chain!: SupportChain;
  @ApiProperty({ example: TOKENS }) symbol!: Token;
  @ApiProperty({ example: "100000000000000000000" })
  minUnits!: string;
  @ApiProperty({ example: 100 }) display!: number;
}

export class ContractsDto {
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd...", polygon: "0x1234abcd..." } })
  delegate!: Record<SupportChain, string>;
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd...", polygon: "0x1234abcd..." } })
  registry!: Record<SupportChain, string>;
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd...", polygon: "0x1234abcd..." } })
  sponsor!: Record<SupportChain, string>;
}

export class MetaSummaryDto {
  @ApiProperty({ example: "v1" }) schemaVersion!: string;
  @ApiProperty({ type: [TokenAddressDto] }) tokens!: TokenAddressDto[];
  @ApiProperty({ type: [FeeItemDto] }) fixedFees!: FeeItemDto[];
  @ApiProperty({ type: [MinTransferItemDto] }) minTransfers!: MinTransferItemDto[];
  @ApiProperty({ type: ContractsDto }) contracts!: ContractsDto;
}
