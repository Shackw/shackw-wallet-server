import { encodeFunctionData, encodeAbiParameters, keccak256, erc20Abi, type Hex, getAddress } from "viem";

import type { EvmCallValueObject } from "@/domain/value-objects/evm-call.value-object";
import type { ExecutionIntentValueObject } from "@/domain/value-objects/execution-intent.value-object";

import { EXECUTION_INTENT_ENCODING_TYPES } from "./execution-intent.protocol.encoding";

import type {
  BuildErc20TransferCallInput,
  BuildExecutionIntentInput,
  BuildExecutionIntentOutput
} from "./execution-intent.protocol.types";

export function buildExcutionIntent(input: BuildExecutionIntentInput): BuildExecutionIntentOutput {
  // Build ERC20 transfer call (recipient payment)
  const transferAmountCallData = erc20TransferCall({
    token: input.token,
    to: input.recipient,
    amountMinUnits: input.amountMinUnits
  });

  // Build ERC20 transfer call (fixed fee to sponsor)
  const transferFeeCallData = erc20TransferCall({
    token: input.feeToken,
    to: input.sponsor,
    amountMinUnits: input.feeMinUnits
  });

  // Hash execution intent (amount + fee transfers)
  const executionIntent = hashExecutionIntent({
    chainId: input.chainId,
    sender: input.sender,
    calls: [transferAmountCallData, transferFeeCallData],
    expiresAtSec: input.expiresAtSec,
    nonce: input.nonce
  });

  return { calls: [transferAmountCallData, transferFeeCallData], callHash: executionIntent };
}

function erc20TransferCall(input: BuildErc20TransferCallInput): EvmCallValueObject {
  return {
    to: getAddress(input.token),
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [getAddress(input.to), input.amountMinUnits]
    })
  };
}

function hashExecutionIntent(input: ExecutionIntentValueObject): Hex {
  const encoded = encodeAbiParameters(EXECUTION_INTENT_ENCODING_TYPES, [
    BigInt(input.chainId),
    getAddress(input.sender),
    input.calls,
    input.expiresAtSec,
    input.nonce
  ]);
  return keccak256(encoded);
}
