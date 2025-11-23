import { Inject, Injectable } from "@nestjs/common";

import {
  InsightContranctEventItem,
  InsightContranctEventsBaseQuery,
  InsightContranctEventsGateway,
  InsightContranctEventsQuery
} from "@/application/ports/insight-contracr-events.gateway";
import { CHAINS } from "@/config/chain.config";
import { TransactionModel } from "@/domain/entities/transaction";
import { SearchTransactionsRequestDto } from "@/interfaces/dto/transactions.dto";
import { resolveTokenAddress } from "@/registries/token-chain.registry";

import { insightEventToTransaction } from "../mappers/transaction.mapper";

@Injectable()
export class TransactionsService {
  constructor(
    @Inject("InsightWalletTransactionsGateway")
    private readonly insightGateway: InsightContranctEventsGateway
  ) {}

  async searchTransactions(dto: SearchTransactionsRequestDto): Promise<TransactionModel[]> {
    const { chain, tokens, wallet, timestampGte, timestampLte, direction, limit } = dto;

    const works: Promise<InsightContranctEventItem[]>[] = [];
    for (const { symbol } of tokens) {
      const baseQuery: InsightContranctEventsBaseQuery = {
        chainId: CHAINS[chain].id,
        tokenAddress: resolveTokenAddress(symbol, chain),
        timestampGte,
        timestampLte,
        limit: 100,
        page: 2
      };
      if (direction === "in" || direction === "both")
        works.push(this.fetchContractEvents({ ...baseQuery, toAddress: wallet }));
      if (direction === "out" || direction === "both")
        works.push(this.fetchContractEvents({ ...baseQuery, fromAddress: wallet }));
    }

    const fetcheds = await Promise.all(works);
    const flateds = fetcheds.flat();

    const uniqueMap = new Map<string, InsightContranctEventItem>();
    for (const ev of flateds) {
      const key = `${ev.transactionHash}:${ev.logIndex}:${ev.blockNumber}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, ev);
    }
    const uniques = Array.from(uniqueMap.values());

    const mappeds = uniques.map(ev => insightEventToTransaction(chain, wallet, ev));

    const sorteds = mappeds.sort((a, b) => {
      if (a.transferredAt.getTime() !== b.transferredAt.getTime())
        return b.transferredAt.getTime() - a.transferredAt.getTime();

      if (a.blockNumber !== b.blockNumber) return a.blockNumber > b.blockNumber ? -1 : 1;

      return a.logIndex - b.logIndex;
    });

    const limited = limit ? sorteds.slice(0, limit) : sorteds;

    return limited;
  }

  private async fetchContractEvents(query: InsightContranctEventsQuery): Promise<InsightContranctEventItem[]> {
    const results: InsightContranctEventItem[] = [];

    let page = query.page;
    while (true) {
      const fetched = await this.insightGateway.fetch({ ...query, page });

      const { events, pagination } = fetched.result;
      results.push(...events);

      const { limit, totalCount } = pagination;
      if (limit === totalCount) page++;
      else break;
    }

    return results;
  }
}
