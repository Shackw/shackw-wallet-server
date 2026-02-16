import type { Chain } from "@/config/chain.config";
import type { NotifyWebhook } from "@/interfaces/dto/shapes/notify.shape";

import type { Hex } from "viem";

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
