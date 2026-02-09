import type { Chain } from "@/config/chain.config";
import type { TransactionEntity, TransferDirection } from "@/domain/entities/transaction";
import { ADDRESS_TO_TOKEN, TOKEN_REGISTRY } from "@/registries/token-chain.registry";

import type { MorarisTokenTransferItemContract } from "../ports/moraris-token-transfers.port";
import type { ThirdwebContranctEventItemContract } from "../ports/thirdweb-contract-events.port";
import type { Address, Hex } from "viem";

export const thirdwebContractEventToTransaction = (
  chain: Chain,
  wallet: Address,
  event: ThirdwebContranctEventItemContract
): TransactionEntity => {
  const tokenSymbol = ADDRESS_TO_TOKEN[chain][event.address.toLowerCase()];
  const tokenMeta = TOKEN_REGISTRY[tokenSymbol];

  const decoded = event.decoded;

  const from = decoded.params.from;
  const to = decoded.params.to;

  const walletLc = wallet.toLowerCase();
  const fromLc = from.toLowerCase();
  const toLc = to.toLowerCase();

  const direction: TransferDirection =
    walletLc === fromLc && walletLc === toLc ? "self" : walletLc === fromLc ? "out" : "in";

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

export const morarisTokenTransfersToTransaction = (
  chain: Chain,
  wallet: Address,
  transfer: MorarisTokenTransferItemContract
): TransactionEntity => {
  const tokenSymbol = ADDRESS_TO_TOKEN[chain][transfer.address.toLowerCase()];
  const tokenMeta = TOKEN_REGISTRY[tokenSymbol];

  const from = transfer.from_address;
  const to = transfer.to_address;

  const walletLc = wallet.toLowerCase();
  const fromLc = from.toLowerCase();
  const toLc = to.toLowerCase();

  const direction: TransferDirection =
    walletLc === fromLc && walletLc === toLc ? "self" : walletLc === fromLc ? "out" : "in";

  return {
    txHash: transfer.transaction_hash as Hex,
    blockNumber: BigInt(transfer.block_number),
    logIndex: transfer.log_index,
    token: {
      symbol: tokenSymbol,
      address: transfer.address as Address,
      decimals: tokenMeta.decimals
    },
    direction: direction,
    value: {
      symbol: tokenSymbol,
      minUnits: BigInt(transfer.value),
      decimals: tokenMeta.decimals
    },
    counterparty: {
      address: (direction === "out" ? to : from) as Address
    },
    transferredAt: new Date(transfer.block_timestamp)
  };
};
