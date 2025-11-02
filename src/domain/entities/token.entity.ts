import { Hex } from "viem";

export type TransferTokenModel = {
  status: "submitted";
  txHash: Hex;
  notify?: { webhook: { id: string; url: string; echo: string } };
};
