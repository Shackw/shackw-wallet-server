export const QUOTE_TOKEN_ENCODING_TYPES = [
  { name: "v", type: "uint8" },
  { name: "chainId", type: "uint256" },
  { name: "sender", type: "address" },
  { name: "recipient", type: "address" },
  { name: "token", type: "address" },
  { name: "feeToken", type: "address" },
  { name: "amountMinUnits", type: "uint256" },
  { name: "feeMinUnits", type: "uint256" },
  { name: "delegate", type: "address" },
  { name: "sponsor", type: "address" },
  { name: "expiresAt", type: "uint64" },
  { name: "nonce", type: "uint256" },
  { name: "callHash", type: "bytes32" }
] as const;
