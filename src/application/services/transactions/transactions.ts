import { Inject, Injectable } from "@nestjs/common";
import { Address } from "viem";

import type {
  ThirdwebContranctEventItemContract,
  ThirdwebContranctEventsBaseQuery,
  ThirdwebContranctEventsGateway,
  ThirdwebContranctEventsQuery
} from "@/application/ports/thirdweb-contract-events.gateway.port";
import { CHAINS, Chain } from "@/config/chain.config";
import { resolveTokenAddress } from "@/config/token.config";
import { TransactionEntity } from "@/domain/entities/transaction";
import { SearchTransactionsRequestDto } from "@/interfaces/dto/transactions.dto";

import { morarisTokenTransfersToTransaction, thirdwebContractEventToTransaction } from "../mappers/transaction.mapper";

import type {
  MoralisTokenTransferItemContract,
  MoralisTokenTransfersGateway
} from "../ports/moralis-token-transfers.gateway.port";

@Injectable()
export class TransactionsService {
  constructor(
    @Inject("ThirdwebContractEventsGateway")
    private readonly contranctEventsGateway: ThirdwebContranctEventsGateway,

    @Inject("MorarisTokenTransfersGateway")
    private readonly tokenTransfersGateway: MoralisTokenTransfersGateway
  ) {}

  async searchTransactions(dto: SearchTransactionsRequestDto): Promise<TransactionEntity[]> {
    const { chain, tokens, wallet, timestampGte, timestampLte, direction, limit } = dto;

    const thirdwebEvents: ThirdwebContranctEventItemContract[] = [];
    const failedTokenAddresses: Address[] = [];

    for (const { symbol } of tokens) {
      const tokenAddress = resolveTokenAddress(symbol, chain);

      try {
        const events = await this.fetchThirdwebForToken({
          chain,
          wallet,
          tokenAddress,
          timestampGte,
          timestampLte,
          direction
        });
        thirdwebEvents.push(...events);
      } catch {
        failedTokenAddresses.push(tokenAddress);
      }
    }

    const thirdwebTxs = thirdwebEvents.map(ev => thirdwebContractEventToTransaction(chain, wallet, ev));

    let moralisTxs: TransactionEntity[] = [];
    if (failedTokenAddresses.length > 0) {
      moralisTxs = await this.fetchMoralisForTokens({
        chain,
        wallet,
        timestampGte,
        timestampLte,
        direction,
        tokenAddresses: failedTokenAddresses,
        limit
      });
    }

    const merged = [...thirdwebTxs, ...moralisTxs];
    return this.dedupeSortAndLimit(merged, limit);
  }

  // ========== Thirdweb ==========
  private async fetchThirdwebForToken(params: {
    chain: Chain;
    wallet: Address;
    tokenAddress: Address;
    timestampGte: number;
    timestampLte: number;
    direction: SearchTransactionsRequestDto["direction"];
  }): Promise<ThirdwebContranctEventItemContract[]> {
    const { chain, wallet, tokenAddress, timestampGte, timestampLte, direction } = params;

    const baseQuery: ThirdwebContranctEventsBaseQuery = {
      chainId: CHAINS[chain].id,
      tokenAddress,
      timestampGte,
      timestampLte,
      limit: 100,
      page: 1
    };

    const works: Promise<ThirdwebContranctEventItemContract[]>[] = [];

    if (direction === "in" || direction === "both") {
      works.push(this.fetchContractEvents({ ...baseQuery, toAddress: wallet }));
    }
    if (direction === "out" || direction === "both") {
      works.push(this.fetchContractEvents({ ...baseQuery, fromAddress: wallet }));
    }

    if (works.length === 0) return [];
    const fetcheds = await Promise.all(works);
    return fetcheds.flat();
  }

  private async fetchContractEvents(
    query: ThirdwebContranctEventsQuery
  ): Promise<ThirdwebContranctEventItemContract[]> {
    const results: ThirdwebContranctEventItemContract[] = [];
    let page = query.page;

    while (true) {
      const fetched = await this.contranctEventsGateway.fetch({ ...query, page });
      const { events, pagination } = fetched.result;
      results.push(...events);

      const { limit, totalCount } = pagination;
      if (limit === totalCount) page++;
      else break;
    }

    return results;
  }

  // ========== Moralis fallback ==========
  private async fetchMoralisForTokens(params: {
    chain: Chain;
    wallet: Address;
    timestampGte: number;
    timestampLte: number;
    direction: SearchTransactionsRequestDto["direction"];
    tokenAddresses: Address[];
    limit?: number;
  }): Promise<TransactionEntity[]> {
    const { chain, wallet, timestampGte, timestampLte, direction, tokenAddresses, limit } = params;

    const allTransfers: MoralisTokenTransferItemContract[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
      const fetched = await this.tokenTransfersGateway.fetch({
        chain,
        wallet,
        fromDate: timestampGte,
        toDate: timestampLte,
        tokenAddresses,
        limit: 100,
        cursor
      });

      allTransfers.push(...fetched.result);
      cursor = fetched.cursor ?? undefined;

      const reachedLimit = !!limit && allTransfers.length >= limit;
      if (!cursor || reachedLimit) break;
    }

    let txs = allTransfers.map(t => morarisTokenTransfersToTransaction(chain, wallet, t));

    if (direction === "in") {
      txs = txs.filter(tx => tx.direction === "in" || tx.direction === "self");
    } else if (direction === "out") {
      txs = txs.filter(tx => tx.direction === "out" || tx.direction === "self");
    }

    return txs;
  }

  // ========== uniq / sort / limit ==========
  private dedupeSortAndLimit(transactions: TransactionEntity[], limit?: number): TransactionEntity[] {
    const uniqueMap = new Map<string, TransactionEntity>();

    for (const tx of transactions) {
      const key = `${tx.txHash}:${tx.logIndex}:${tx.blockNumber}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, tx);
    }

    const uniques = Array.from(uniqueMap.values());

    uniques.sort((a, b) => {
      if (a.transferredAt.getTime() !== b.transferredAt.getTime()) {
        return b.transferredAt.getTime() - a.transferredAt.getTime();
      }
      if (a.blockNumber !== b.blockNumber) {
        return a.blockNumber > b.blockNumber ? -1 : 1;
      }
      return a.logIndex - b.logIndex;
    });

    return limit ? uniques.slice(0, limit) : uniques;
  }
}
