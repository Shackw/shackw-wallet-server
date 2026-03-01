import { Inject, Injectable } from "@nestjs/common";
import { Address, isAddressEqual } from "viem";

import { ChainToTokenSupport } from "@/application/policies/chain-to-token-support";
import { TokenMasterContract } from "@/application/ports/config/token-deployment.repository.port";
import { MoralisApiGateway } from "@/application/ports/http/moralis-api.gateway.port";
import { ThirdwebApiGateway } from "@/application/ports/http/thirdweb-api.gateway.por";
import { TransactionEntity } from "@/domain/entities/transaction";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { SearchTransactionsInput } from "./transactions.service.type";

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DI_TOKENS.THIRDWEB_API_GATEWAY)
    private readonly thirdwebApiGateway: ThirdwebApiGateway,

    @Inject(DI_TOKENS.MORALIS_API_GATEWAY)
    private readonly moralisApiGateway: MoralisApiGateway,

    private readonly chainToTokenSupport: ChainToTokenSupport
  ) {}

  async searchTransactions(input: SearchTransactionsInput): Promise<TransactionEntity[]> {
    const { chainKey, tokenSymbols, walletAddress, timestampGte, timestampLte, searchDirection, limit } = input;

    const tokenDeps = tokenSymbols.map(symbol =>
      this.chainToTokenSupport.execute({ chainKey: chainKey, tokenSymbol: symbol })
    );
    const addrToDep = tokenDeps.reduce<Record<Address, TokenMasterContract>>((acc, dep) => {
      const key = dep.token.address;
      acc[key] = dep.token;
      return acc;
    }, {});

    const tokenAddresses = tokenDeps.map(dep => dep.token.address);
    const addrFil = (() => {
      switch (searchDirection) {
        case "in":
          return { toAddress: walletAddress };
        case "out":
          return { fromAddress: walletAddress };
        case "both":
          return { toAddress: walletAddress, fromAddress: walletAddress };
      }
    })();

    const contracts = await this.thirdwebApiGateway
      .searchContractEvents({
        chainId: tokenDeps[0].chain.id,
        tokenAddresses,
        timestampLte,
        timestampGte,
        sortOrder: "desc",
        ...addrFil
      })
      .catch(async () => {
        return await this.moralisApiGateway.searchTransfers({
          chain: chainKey,
          tokenAddresses,
          wallet: walletAddress,
          timestampLte,
          timestampGte,
          sortOrder: "desc"
        });
      });

    const results: TransactionEntity[] = [];
    for (const c of contracts) {
      if (results.length === limit) break;

      const txDir: TransactionEntity["direction"] = (() => {
        const isEqTo = isAddressEqual(walletAddress, c.toAddress);
        const isEqFrom = isAddressEqual(walletAddress, c.fromAddress);

        if (isEqFrom && isEqTo) return "self";
        if (isEqTo) return "in";
        return "out";
      })();

      const peerAddr: Address = (() => {
        switch (txDir) {
          case "in":
            return c.fromAddress;
          case "out":
            return c.toAddress;
          case "self":
            return walletAddress;
        }
      })();

      // MEMO Do not add to results if the direction does not match.
      if (searchDirection === "in" && txDir === "out") continue;
      if (searchDirection === "out" && txDir === "in") continue;

      const entity: TransactionEntity = {
        txHash: c.txHash,
        blockNumber: c.blockNumber,
        logIndex: c.logIndex,
        token: {
          symbol: addrToDep[c.tokenAddress].symbol,
          address: c.tokenAddress,
          decimals: addrToDep[c.tokenAddress].decimals
        },
        direction: txDir,
        value: {
          symbol: addrToDep[c.tokenAddress].symbol,
          minUnits: c.valueMinUnits,
          decimals: addrToDep[c.tokenAddress].decimals
        },
        counterparty: {
          address: peerAddr
        },
        transferredAt: c.transferredAt
      };

      results.push(entity);
    }

    return results;
  }
}
