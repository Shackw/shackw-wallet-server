import { Account, Chain, createWalletClient, http, Transport, WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { DEFAULT_CHAIN } from "./chain.config";
import { ENV } from "./env.config";

export const SPONSOR_ACCOUNT = privateKeyToAccount(ENV.SPONSOR_PK);

export const SPONSOR_CLIENT: WalletClient<Transport, Chain, Account> = createWalletClient({
  account: SPONSOR_ACCOUNT,
  chain: DEFAULT_CHAIN,
  transport: http()
});
