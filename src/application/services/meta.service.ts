import { Injectable } from "@nestjs/common";
import { formatUnits } from "viem";

import { SupportChain } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import {
  MetaSummaryDto,
  FeeItemDto,
  MinTransferItemDto,
  ContractsDto,
  TokenAddressDto
} from "@/interfaces/dto/meta.dto";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY, Token } from "@/registries/token-chain.registry";

@Injectable()
export class MetaService {
  buildTokens(): TokenAddressDto[] {
    return Object.entries(TOKEN_REGISTRY).map(([symbol, meta]) => ({
      symbol: symbol as Token,
      address: meta.address,
      decimals: meta.decimals
    }));
  }

  buildFees(): FeeItemDto[] {
    const out: FeeItemDto[] = [];
    for (const [chain, tokens] of Object.entries(FEE_REGISTORY) as [
      SupportChain,
      (typeof FEE_REGISTORY)[SupportChain]
    ][]) {
      for (const [symbol, { fixedFeeAmountUnits }] of Object.entries(tokens) as [
        Token,
        { fixedFeeAmountUnits: bigint }
      ][]) {
        out.push({
          chain,
          symbol,
          fixedFeeAmountUnits: fixedFeeAmountUnits.toString(),
          fixedFeeAmountDisplay: Number(formatUnits(fixedFeeAmountUnits, TOKEN_REGISTRY[symbol].decimals))
        });
      }
    }
    return out;
  }

  buildMinTransfers(): MinTransferItemDto[] {
    const out: MinTransferItemDto[] = [];
    for (const [chain, tokens] of Object.entries(FEE_REGISTORY) as [
      SupportChain,
      (typeof FEE_REGISTORY)[SupportChain]
    ][]) {
      for (const [symbol, { minTransferAmountUnits }] of Object.entries(tokens) as [
        Token,
        { minTransferAmountUnits: bigint }
      ][]) {
        out.push({
          chain,
          symbol,
          minUnits: minTransferAmountUnits.toString(),
          display: Number(formatUnits(minTransferAmountUnits, TOKEN_REGISTRY[symbol].decimals))
        });
      }
    }
    return out;
  }

  buildContracts(): ContractsDto {
    const sponsor = ENV.SPONSOR_ADDRESS;
    return {
      delegate: {
        main: ENV.MAIN_DELEGATE_ADDRESS,
        base: ENV.BASE_DELEGATE_ADDRESS,
        polygon: ENV.POLYGON_DELEGATE_ADDRESS
      },
      registry: {
        main: ENV.MAIN_REGISTRY_ADDRESS,
        base: ENV.BASE_REGISTRY_ADDRESS,
        polygon: ENV.POLYGON_REGISTRY_ADDRESS
      },
      sponsor: { main: sponsor, base: sponsor, polygon: sponsor }
    };
  }

  buildSummary(): MetaSummaryDto {
    return {
      schemaVersion: "v1",
      tokens: this.buildTokens(),
      fixedFees: this.buildFees(),
      minTransfers: this.buildMinTransfers(),
      contracts: this.buildContracts()
    };
  }
}
