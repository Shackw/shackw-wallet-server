/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from "@nestjs/common";

import { CHAINS } from "@/config/chain.config";
import { httpClient } from "@/infrastructure/http/client/http.client";
import { VIEM_PUBLIC_CLIENTS } from "@/registries/viem.registry";

import type { StartSettlementWebhookJobInput, SettlementWebhookJobPayload } from "./settlement.worker.interface";

export const startSettlementWebhookJob = (input: StartSettlementWebhookJobInput): void => {
  const { chain, txHash, webhook } = input;

  setImmediate(() => {
    void (async () => {
      const chainId = CHAINS[chain].id;
      try {
        // included
        const receiptIncluded = await VIEM_PUBLIC_CLIENTS[chain].waitForTransactionReceipt({ hash: txHash });
        const includedPayload: SettlementWebhookJobPayload = {
          id: webhook.id,
          echo: webhook.echo,
          status: "included",
          txHash,
          chainId,
          blockNumber: receiptIncluded.blockNumber.toString(),
          occurredAt: new Date().toISOString()
        };
        try {
          await httpClient.post(webhook.url, includedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:included:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.warn(e, "SettlementWebhookJob");
        }

        // confirmed (K=2)
        const receiptConfirmed = await VIEM_PUBLIC_CLIENTS[chain].waitForTransactionReceipt({
          hash: txHash,
          confirmations: 2
        });
        const confirmedPayload: SettlementWebhookJobPayload = {
          id: webhook.id,
          echo: webhook.echo,
          status: "confirmed",
          txHash,
          chainId,
          blockNumber: receiptConfirmed.blockNumber.toString(),
          occurredAt: new Date().toISOString()
        };
        try {
          await httpClient.post(webhook.url, confirmedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:confirmed:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.warn(e, "SettlementWebhookJob");
        }
      } catch (error: any) {
        // failed
        const failedPayload: SettlementWebhookJobPayload = {
          id: webhook.id,
          echo: webhook.echo,
          status: "failed",
          txHash,
          chainId,
          error: {
            code: error?.code ?? "SETTLEMENT_ERROR",
            message: String(error?.message ?? error)
          },
          occurredAt: new Date().toISOString()
        };
        try {
          await httpClient.post(webhook.url, failedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:failed:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.warn(e, "SettlementWebhookJob");
        }
      }
    })();
  });
};
