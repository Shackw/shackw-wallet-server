import { encodeFunctionData, encodeAbiParameters, keccak256, erc20Abi, type Address, type Hex } from "viem";

import { INTENT_TYPES } from "../encodings/intent.abi";
import { Call } from "../types/call.type";
import { ExecutionIntent } from "../types/execution-intent.type";

export function erc20TransferCall(params: { token: Address; to: Address; amountMinUnits: bigint }): Call {
  return {
    to: params.token,
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [params.to, params.amountMinUnits]
    })
  };
}

export function hashExecutionIntent(i: ExecutionIntent): Hex {
  const encoded = encodeAbiParameters(INTENT_TYPES, [
    BigInt(i.chainId),
    i.sender,
    i.delegate,
    i.sponsor,
    i.calls,
    i.expiresAtSec,
    i.nonce32
  ]);
  return keccak256(encoded);
}
