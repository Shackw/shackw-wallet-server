import type { Hex } from "viem";

export type TransferTokenEntity = {
  status: "submitted";
  txHash: Hex;
};
