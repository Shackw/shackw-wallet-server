import type { ThirdwebSearchContractEventsContract } from "@/application/ports/http/thirdweb-api.gateway.por";

import type { ThirdwebSearchContractEventsResponseExternal } from "../externals/thirdweb-api.external";

export const toThirdwebSearchContractEventsContract = (
  response: ThirdwebSearchContractEventsResponseExternal["result"]["events"][number]
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
