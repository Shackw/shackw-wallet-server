import type { ThirdwebSearchContractEventsContract } from "@/application/ports/gateways/thirdweb.gateway.port";

import type { ThirdwebSearchContractEventsResponseDto } from "./http-thirdweb.dto";

export const toThirdwebSearchContractEventsContract = (
  response: ThirdwebSearchContractEventsResponseDto["result"]["events"][number]
): ThirdwebSearchContractEventsContract => {
  return {
    txHash: response.transactionHash,
    blockNumber: response.blockNumber,
    logIndex: response.logIndex,
    tokenAddress: response.address,
    fromAddress: response.decoded.params.from,
    toAddress: response.decoded.params.from,
    valueMinUnits: response.decoded.params.value,
    transferredAt: response.blockTimestamp
  };
};
