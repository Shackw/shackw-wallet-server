import { Account, Chain, createWalletClient, http, Transport, WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { SupportChain, SUPPORT_CHAINS } from "../configs/chain.config";
import { ENV } from "../configs/env.config";
import { CUSTOM_RPC_URLS } from "../configs/rpc-urls.config";

export const SPONSOR_ACCOUNT = privateKeyToAccount(ENV.SPONSOR_PK);

export const SPONSOR_CLIENTS: Record<SupportChain, WalletClient<Transport, Chain, Account>> = {
  main: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: SUPPORT_CHAINS.main,
    transport: http(CUSTOM_RPC_URLS.main)
  }),
  base: createWalletClient({
    account: SPONSOR_ACCOUNT,
    chain: SUPPORT_CHAINS.base,
    transport: http(CUSTOM_RPC_URLS.base)
  })
};
