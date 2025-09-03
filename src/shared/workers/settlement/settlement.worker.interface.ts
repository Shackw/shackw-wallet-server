import { Hex } from "viem";

import { NotifyWebhook } from "@/validations/shapes/notify.shape";

export type StartSettlementWebhookJobInput = {
  txHash: Hex;
  chainId: number;
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
