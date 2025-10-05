import { Hex } from "viem";

export type TransferTokenModel = {
  status: "submitted";
  txHash: Hex;
  notify?: { webhook: { id: string; echo: string } };
};
