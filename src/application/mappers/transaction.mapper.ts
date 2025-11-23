import { Address, Hex } from "viem";

import { Chain } from "@/config/chain.config";
import { TransactionModel, TransferDirection } from "@/domain/entities/transaction";
import { ADDRESS_TO_TOKEN, TOKEN_REGISTRY } from "@/registries/token-chain.registry";

import { InsightContranctEventItem } from "../ports/insight-contract-events.gateway";

export const insightEventToTransaction = (
  chain: Chain,
  wallet: Address,
  event: InsightContranctEventItem
): TransactionModel => {
  const decoded = event.decoded;

  const from = decoded.params.from;
  const to = decoded.params.to;

  const walletLc = wallet.toLowerCase();
  const fromLc = from.toLowerCase();
  const toLc = to.toLowerCase();

  const direction: TransferDirection =
    walletLc === fromLc && walletLc === toLc ? "self" : walletLc === fromLc ? "out" : "in";

  const tokenSymbol = ADDRESS_TO_TOKEN[chain][event.address.toLowerCase()];
  const tokenMeta = TOKEN_REGISTRY[tokenSymbol];

  return {
    txHash: event.transactionHash as Hex,
    blockNumber: BigInt(event.blockNumber),
    logIndex: event.logIndex,
    token: {
      symbol: tokenSymbol,
      address: event.address as Address,
      decimals: tokenMeta.decimals
    },
    direction,
    value: {
      symbol: tokenSymbol,
      minUnits: BigInt(decoded.params.value),
      decimals: tokenMeta.decimals
    },
    counterparty: {
      address: (direction === "out" ? to : from) as Address
    },
    transferredAt: new Date(event.blockTimestamp * 1000)
  };
};
