import { Hex } from "viem";

import { SupportChain } from "@/configs/chain.config";
import { NotifyWebhook } from "@/validations/shapes/notify.shape";

export type StartSettlementWebhookJobInput = {
  chain: SupportChain;
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
