export const REGISTRY_ABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { internalType: "address", name: "initialOwner", type: "address" },
      { internalType: "address", name: "sponsor_", type: "address" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "setSponsor",
    inputs: [{ internalType: "address", name: "sponsor", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getSponsor",
    inputs: [],
    outputs: [{ internalType: "address", name: "", type: "address" }]
  },
  {
    type: "function",
    stateMutability: "view",
    name: "nextNonce",
    inputs: [{ internalType: "address", name: "eoa", type: "address" }],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "useNonce",
    inputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
    outputs: []
  },
  {
    type: "event",
    anonymous: false,
    name: "SponsorUpdated",
    inputs: [{ indexed: true, internalType: "address", name: "sponsor", type: "address" }]
  },
  {
    type: "error",
    name: "SponsorZeroAddress",
    inputs: []
  },
  {
    type: "error",
    name: "BadNonce",
    inputs: [
      { internalType: "uint256", name: "expected", type: "uint256" },
      { internalType: "uint256", name: "got", type: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "view",
    name: "owner",
    inputs: [],
    outputs: [{ internalType: "address", name: "", type: "address" }]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "renounceOwnership",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "transferOwnership",
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    outputs: []
  },
  {
    type: "event",
    anonymous: false,
    name: "OwnershipTransferred",
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" }
    ]
  }
] as const;
