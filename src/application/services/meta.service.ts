import { Injectable } from "@nestjs/common";
import { formatUnits } from "viem";

import { Chain, CHAINS } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import {
  MetaSummaryDto,
  FeeMetaDto,
  MinTransferMetaDto,
  ContractsMetaDto,
  TokenMetaDto,
  ChainMetaDto
} from "@/interfaces/dto/meta.dto";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import {
  DELEGATE_CONTRACT_ADDRESS_REGISTORY,
  REGISTRY_CONTRACT_ADDRESS_REGISTORY
} from "@/registries/invoker.registry";
import { TOKEN_REGISTRY, Token } from "@/registries/token-chain.registry";

@Injectable()
export class MetaService {
  buildChains(): ChainMetaDto[] {
    return Object.entries(CHAINS).map(([symbol, meta]) => ({
      symbol: symbol as Chain,
      id: meta.id,
      testnet: meta.testnet ?? false
    }));
  }

  buildTokens(): TokenMetaDto[] {
    return Object.entries(TOKEN_REGISTRY).map(([symbol, meta]) => ({
      symbol: symbol as Token,
      address: meta.address,
      decimals: meta.decimals
    }));
  }

  buildFees(): FeeMetaDto[] {
    const out: FeeMetaDto[] = [];
    for (const [chain, tokens] of Object.entries(FEE_REGISTORY) as [Chain, (typeof FEE_REGISTORY)[Chain]][]) {
      for (const [token, { fixedFeeAmountUnits }] of Object.entries(tokens) as [
        Token,
        { fixedFeeAmountUnits: bigint }
      ][]) {
        out.push({
          chainSymbol: chain,
          tokenSymbol: token,
          fixedFeeAmountUnits: fixedFeeAmountUnits.toString(),
          fixedFeeAmountDisplay: Number(formatUnits(fixedFeeAmountUnits, TOKEN_REGISTRY[token].decimals))
        });
      }
    }
    return out;
  }

  buildMinTransfers(): MinTransferMetaDto[] {
    const out: MinTransferMetaDto[] = [];
    for (const [chain, tokens] of Object.entries(FEE_REGISTORY) as [Chain, (typeof FEE_REGISTORY)[Chain]][]) {
      for (const [token, { minTransferAmountUnits }] of Object.entries(tokens) as [
        Token,
        { minTransferAmountUnits: bigint }
      ][]) {
        out.push({
          chainSymbol: chain,
          tokenSymbol: token,
          minUnits: minTransferAmountUnits.toString(),
          display: Number(formatUnits(minTransferAmountUnits, TOKEN_REGISTRY[token].decimals))
        });
      }
    }
    return out;
  }

  buildContracts(): ContractsMetaDto {
    const sponsor = ENV.SPONSOR_ADDRESS;
    return {
      sponsor,
      delegate: DELEGATE_CONTRACT_ADDRESS_REGISTORY,
      registry: REGISTRY_CONTRACT_ADDRESS_REGISTORY
    };
  }

  buildSummary(): MetaSummaryDto {
    return {
      schemaVersion: "v1",
      chains: this.buildChains(),
      tokens: this.buildTokens(),
      fixedFees: this.buildFees(),
      minTransfers: this.buildMinTransfers(),
      contracts: this.buildContracts()
    };
  }
}
