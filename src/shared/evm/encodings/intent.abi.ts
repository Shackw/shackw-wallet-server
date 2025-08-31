export const CALL_TUPLE = {
  name: "calls",
  type: "tuple[]",
  components: [
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "data", type: "bytes" }
  ]
} as const;

export const INTENT_TYPES = [
  { name: "chainId", type: "uint256" },
  { name: "sender", type: "address" },
  { name: "delegate", type: "address" },
  { name: "sponsor", type: "address" },
  CALL_TUPLE,
  { name: "expiresAt", type: "uint64" },
  { name: "nonce32", type: "bytes32" }
] as const;
