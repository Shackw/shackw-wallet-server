import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import type { Chain } from "@/config/chain.config";
import { CHAINS } from "@/config/chain.config";
import { ENV } from "@/config/env.config";
import { CUSTOM_RPC_URL } from "@/config/rpc-urls.config";

import type { Account, Chain as ViemChain, Transport, WalletClient } from "viem";

export const SPONSOR_ACCOUNT = privateKeyToAccount(ENV.SPONSOR_PK);

export const SPONSOR_CLIENTS: Record<Chain, WalletClient<Transport, ViemChain, Account>> = {
  mainnet: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.mainnet,
    transport: http(CUSTOM_RPC_URL.mainnet)
  }),
  base: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.base,
    transport: http(CUSTOM_RPC_URL.base)
  }),
  polygon: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.polygon,
    transport: http(CUSTOM_RPC_URL.polygon)
  }),
  sepolia: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.sepolia,
    transport: http(CUSTOM_RPC_URL.sepolia)
  }),
  baseSepolia: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.baseSepolia,
    transport: http(CUSTOM_RPC_URL.baseSepolia)
  }),
  polygonAmoy: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: CHAINS.polygonAmoy,
    transport: http(CUSTOM_RPC_URL.polygonAmoy)
  })
};
