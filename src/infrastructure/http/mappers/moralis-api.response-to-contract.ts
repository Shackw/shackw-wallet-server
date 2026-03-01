import type { MoralisSearchTransfersContract } from "@/application/ports/http/moralis-api.gateway.port";

import type { MoralisSearchTransfersResponseExternal } from "../externals/moralis-api.external";

export const toMoralisSearchTransfersContract = (
  response: MoralisSearchTransfersResponseExternal["result"][number]
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
