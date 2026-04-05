import type { MoralisSearchTransfersContract } from "@/application/ports/gateways/moralis.gateway.port";

import type { MoralisSearchTransfersResponseDto } from "./http-moralis.dto";

export const toMoralisSearchTransfersContract = (
  response: MoralisSearchTransfersResponseDto["result"][number]
): MoralisSearchTransfersContract => {
  return {
    txHash: response.transaction_hash,
    blockNumber: response.block_number,
    logIndex: response.log_index,
    tokenAddress: response.address,
    fromAddress: response.from_address,
    toAddress: response.to_address,
    valueMinUnits: response.value,
    transferredAt: response.block_timestamp
  };
};
