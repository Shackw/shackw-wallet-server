export const HinomaruDelegationAbi = [
  {
    type: "error",
    name: "BadMsgValue",
    inputs: []
  },
  {
    type: "error",
    name: "EthTransferFailed",
    inputs: [
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "to", type: "address", internalType: "address" }
    ]
  },
  {
    type: "event",
    name: "CallResult",
    inputs: [
      { name: "index", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      { name: "value", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "success", type: "bool", indexed: false, internalType: "bool" },
      { name: "returnData", type: "bytes", indexed: false, internalType: "bytes" }
    ],
    anonymous: false
  },
  {
    type: "function",
    name: "execute",
    stateMutability: "payable",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct HinomaruDelegation.Call[]",
        components: [
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "data", type: "bytes", internalType: "bytes" }
        ]
      },
      { name: "revertOnFail", type: "bool", internalType: "bool" }
    ],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }]
  },
  {
    type: "function",
    name: "executeSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "c",
        type: "tuple",
        internalType: "struct HinomaruDelegation.Call",
        components: [
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "data", type: "bytes", internalType: "bytes" }
        ]
      },
      { name: "revertOnFail", type: "bool", internalType: "bool" }
    ],
    outputs: [{ name: "ret", type: "bytes", internalType: "bytes" }]
  },
  {
    type: "receive",
    stateMutability: "payable"
  }
] as const;
