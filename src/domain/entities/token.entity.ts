import type { Hex } from "viem";

export type TransferTokenEntity = {
  status: "submitted";
  txHash: Hex;
  notify?: { webhook: { id: string; url: string; echo: string } };
};
