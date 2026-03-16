import { Inject, Injectable } from "@nestjs/common";
import { Address, isAddressEqual } from "viem";

import { ChainToTokenSupportPolicy } from "@/application/policies/chain-to-token-support";
import { MoralisGateway } from "@/application/ports/gateways/moralis.gateway.port";
import { ThirdwebGateway } from "@/application/ports/gateways/thirdweb.gateway.port";
import { TokenMasterContract } from "@/application/ports/repositories/token-deployment.repository.port";
import { TransactionEntity } from "@/domain/entities/transaction.entity";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { SearchTransactionsInput } from "./transactions.service.types";

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DI_TOKENS.THIRDWEB_GATEWAY)
    private readonly thirdwebApiGateway: ThirdwebGateway,

    @Inject(DI_TOKENS.MORALIS_GATEWAY)
    private readonly moralisApiGateway: MoralisGateway,

    @Inject(DI_TOKENS.CHAIN_TO_TOKEN_SUPPORT_POLICY)
    private readonly chainToTokenSupport: ChainToTokenSupportPolicy
  ) {}

  async searchTransactions(input: SearchTransactionsInput): Promise<TransactionEntity[]> {
    const { chainKey, tokenSymbols, walletAddress, timestampGte, timestampLte, searchDirection, limit } = input;

    const tokenDeps = tokenSymbols.map(symbol => this.chainToTokenSupport.execute({ chainKey, tokenSymbol: symbol }));
    const addrToDep = tokenDeps.reduce<Record<Address, TokenMasterContract>>((acc, dep) => {
      const key = dep.token.address;
      acc[key] = dep.token;
      return acc;
    }, {});

    const tokenAddresses = tokenDeps.map(dep => dep.token.address);
    const addrFilter = (() => {
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
        ...addrFilter
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
