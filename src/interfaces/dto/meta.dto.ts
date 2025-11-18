import { ApiProperty } from "@nestjs/swagger";

import { CHAIN_IDS, CHAIN_KEYS, Chain } from "@/config/chain.config";
import { Token, TOKENS } from "@/registries/token-chain.registry";

export class ChainMetaDto {
  @ApiProperty({ enum: CHAIN_KEYS }) symbol!: Chain;
  @ApiProperty({ enum: CHAIN_IDS }) id!: number;
  @ApiProperty({ example: false }) testnet!: boolean;
}

export class TokenMetaDto {
  @ApiProperty({ enum: TOKENS }) symbol!: Token;
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd..." } }) address!: Record<string, string>;
  @ApiProperty({ example: 18 }) decimals!: number;
}

export class FeeMetaDto {
  @ApiProperty({ enum: CHAIN_KEYS }) chainSymbol!: Chain;
  @ApiProperty({ example: TOKENS }) tokenSymbol!: Token;
  @ApiProperty({ example: "50000000000000000" }) fixedFeeAmountUnits!: string;
  @ApiProperty({ example: 0.05 }) fixedFeeAmountDisplay!: number;
}

export class MinTransferMetaDto {
  @ApiProperty({ enum: CHAIN_KEYS }) chainSymbol!: Chain;
  @ApiProperty({ example: TOKENS }) tokenSymbol!: Token;
  @ApiProperty({ example: "100000000000000000000" }) minUnits!: string;
  @ApiProperty({ example: 100 }) display!: number;
}

export class ContractsMetaDto {
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd...", polygon: "0x1234abcd..." } })
  delegate!: Record<Chain, string>;
  @ApiProperty({ example: { main: "0x1234abcd...", base: "0x1234abcd...", polygon: "0x1234abcd..." } })
  registry!: Record<Chain, string>;
  @ApiProperty({ example: "0x1234abcd..." })
  sponsor!: string;
}

export class MetaSummaryDto {
  @ApiProperty({ example: "v1" }) schemaVersion!: string;
  @ApiProperty({ type: [ChainMetaDto] }) chains!: ChainMetaDto[];
  @ApiProperty({ type: [TokenMetaDto] }) tokens!: TokenMetaDto[];
  @ApiProperty({ type: [FeeMetaDto] }) fixedFees!: FeeMetaDto[];
  @ApiProperty({ type: [MinTransferMetaDto] }) minTransfers!: MinTransferMetaDto[];
  @ApiProperty({ type: ContractsMetaDto }) contracts!: ContractsMetaDto;
}
