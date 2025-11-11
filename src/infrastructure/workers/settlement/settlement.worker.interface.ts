import { Hex } from "viem";

import { Chain } from "@/config/chain.config";
import { NotifyWebhook } from "@/shared/validations/shapes/notify.shape";

export type StartSettlementWebhookJobInput = {
  chain: Chain;
  txHash: Hex;
  webhook: NotifyWebhook;
};

export type SettlementWebhookJobPayload = {
  id: string;
  echo: string;
  status: "included" | "confirmed" | "failed";
  txHash: Hex;
  chainId: number;
  blockNumber?: string;
  error?: { code: string; message: string };
  occurredAt: string;
};
