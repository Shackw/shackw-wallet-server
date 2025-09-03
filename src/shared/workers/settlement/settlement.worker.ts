/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from "@nestjs/common";

import { restClient } from "@/clients/restClient";
import { VIEM_PUBLIC_CLIENT } from "@/configs/viem.config";

import { StartSettlementWebhookJobInput, SettlementWebhookJobPayload } from "./settlement.worker.interface";

export const startSettlementWebhookJob = (input: StartSettlementWebhookJobInput): void => {
  const { txHash, chainId, webhook } = input;

  setImmediate(() => {
    void (async () => {
      try {
        // included
        const receiptIncluded = await VIEM_PUBLIC_CLIENT.waitForTransactionReceipt({ hash: txHash });
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
          await restClient.post(webhook.url, includedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:included:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.log(e);
        }

        // confirmed (K=2)
        const receiptConfirmed = await VIEM_PUBLIC_CLIENT.waitForTransactionReceipt({
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
          await restClient.post(webhook.url, confirmedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:confirmed:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.log(e);
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
          await restClient.post(webhook.url, failedPayload, {
            headers: { "Idempotency-Key": `${webhook.id}:failed:${txHash}` },
            timeoutMs: 3000
          });
        } catch (e) {
          Logger.log(e);
        }
      }
    })();
  });
};
