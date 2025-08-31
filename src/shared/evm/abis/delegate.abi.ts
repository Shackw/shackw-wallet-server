export const DELEGATE_ABI = [
  // ------------ Constructor ------------
  {
    inputs: [
      { internalType: "address", name: "_sponsor", type: "address" },
      { internalType: "address", name: "initialOwner", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },

  // ------------- Errors ---------------
  { inputs: [], name: "BadMsgValue", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "address", name: "to", type: "address" }
    ],
    name: "EthTransferFailed",
    type: "error"
  },
  { inputs: [], name: "OnlySponsor", type: "error" },
  {
    inputs: [{ internalType: "bytes32", name: "callHash", type: "bytes32" }],
    name: "AlreadyUsed",
    type: "error"
  },
  { inputs: [], name: "SponsorZeroAddress", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "current", type: "address" },
      { internalType: "address", name: "candidate", type: "address" }
    ],
    name: "SponsorUnchanged",
    type: "error"
  },

  // ------------- Events ---------------
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "index", type: "uint256" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
      { indexed: false, internalType: "bool", name: "success", type: "bool" },
      { indexed: false, internalType: "bytes", name: "returnData", type: "bytes" }
    ],
    name: "CallResult",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "bytes32", name: "callHash", type: "bytes32" }],
    name: "CallHashConsumed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousSponsor", type: "address" },
      { indexed: true, internalType: "address", name: "newSponsor", type: "address" }
    ],
    name: "SponsorUpdated",
    type: "event"
  },
  // Ownable
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },

  // ------------ Read funcs ------------
  {
    inputs: [],
    name: "sponsor",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "used",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  // Ownable
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },

  // ----------- Write funcs ------------
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" }
        ],
        internalType: "struct HinomaruDelegation.Call[]",
        name: "calls",
        type: "tuple[]"
      },
      { internalType: "bool", name: "revertOnFail", type: "bool" },
      { internalType: "bytes32", name: "callHash", type: "bytes32" }
    ],
    name: "execute",
    outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newSponsor", type: "address" }],
    name: "setSponsor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Ownable
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // ------------- Receive --------------
  { stateMutability: "payable", type: "receive" }
] as const;
