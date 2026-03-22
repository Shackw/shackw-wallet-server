import { Inject, Injectable } from "@nestjs/common";
import { formatUnits } from "viem/utils";

import type { TokenDeploymentRepository } from "@/application/ports/repositories/token-deployment.repository.port";
import type { Chain } from "@/domain/constants/chain.constant";
import type { Token } from "@/domain/constants/token.constant";
import type {
  ChainMetaEntity,
  TokenMetaEntity,
  FeeMetaEntity,
  MinTransferMetaEntity,
  ContractsMetaEntity,
  MetaSummaryEntity
} from "@/domain/entities/meta.entity";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import type { Address } from "viem";

@Injectable()
export class MetaService {
  constructor(
    @Inject(DI_TOKENS.TOKEN_DEPLOYMENT_REPOSITORY)
    private readonly tokenDepRepository: TokenDeploymentRepository
  ) {}

  async getChainsMeta(): Promise<ChainMetaEntity[]> {
    const chians = await this.tokenDepRepository.listChainMasters();

    return chians.map(chain => ({ id: chain.id, key: chain.key, testnet: chain.viem.testnet ?? false }));
  }

  async getTokensMeta(): Promise<TokenMetaEntity[]> {
    const deps = await this.tokenDepRepository.listTokenDeployment();

    const tokenByEntity = deps.reduce<Record<Token, TokenMetaEntity>>(
      (acc, dep) => {
        if (!acc[dep.token.symbol])
          acc[dep.token.symbol] = {
            symbol: dep.token.symbol,
            decimals: dep.token.decimals,
            address: {}
          };

        acc[dep.token.symbol].address[dep.chain.key] = dep.token.address;

        return acc;
      },
      {} as Record<Token, TokenMetaEntity>
    );

    return Object.values(tokenByEntity);
  }

  async getFeesMeta(): Promise<FeeMetaEntity[]> {
    const deps = await this.tokenDepRepository.listTokenDeployment();

    return deps.map(dep => ({
      chainKey: dep.chain.key,
      tokenSymbol: dep.token.symbol,
      fixedFeeAmountUnits: dep.fixedFeeAmountUnits,
      fixedFeeAmountDisplay: Number(formatUnits(dep.fixedFeeAmountUnits, dep.token.decimals))
    }));
  }

  async getMinTransfersMeta(): Promise<MinTransferMetaEntity[]> {
    const deps = await this.tokenDepRepository.listTokenDeployment();

    return deps.map(dep => ({
      chainKey: dep.chain.key,
      tokenSymbol: dep.token.symbol,
      minTransferAmountUnits: dep.minTransferAmountUnits,
      minTransferAmountDisplay: Number(formatUnits(dep.minTransferAmountUnits, dep.token.decimals))
    }));
  }

  async getContractsMeta(): Promise<ContractsMetaEntity> {
    const chains = await this.tokenDepRepository.listChainMasters();

    return chains.reduce<Record<"sponsor" | "delegate" | "registry", Record<Chain, Address>>>(
      (acc, chain) => {
        acc.sponsor[chain.key] = chain.contracts.sponsor;
        acc.delegate[chain.key] = chain.contracts.delegate;
        acc.registry[chain.key] = chain.contracts.registry;

        return acc;
      },
      { sponsor: {}, delegate: {}, registry: {} } as Record<"sponsor" | "delegate" | "registry", Record<Chain, Address>>
    );
  }

  async getMetaSummary(): Promise<MetaSummaryEntity> {
    return {
      schemaVersion: "v1",
      chains: await this.getChainsMeta(),
      tokens: await this.getTokensMeta(),
      fixedFees: await this.getFeesMeta(),
      minTransfers: await this.getMinTransfersMeta(),
      contracts: await this.getContractsMeta()
    };
  }
}
