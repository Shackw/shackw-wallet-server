import { Hex } from "viem";

export type TransferTokenResponseModel = {
  status: "submitted";
  txHash: Hex;
  notify?: { webhook: { id: string; echo: string } };
};
