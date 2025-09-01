export const DELEGATE_ABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      {
        internalType: "address",
        name: "registry_",
        type: "address"
      }
    ]
  },
  {
    type: "function",
    stateMutability: "view",
    name: "registry",
    inputs: [],
    outputs: [
      {
        internalType: "contract IRegistry",
        name: "",
        type: "address"
      }
    ]
  },
  {
    type: "function",
    stateMutability: "payable",
    name: "execute",
    inputs: [
      {
        internalType: "struct HinomaruDelegate.Call[]",
        name: "calls",
        type: "tuple[]",
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" }
        ]
      },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "expiresAtSec", type: "uint256" },
      { internalType: "bytes32", name: "callHash", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "event",
    anonymous: false,
    name: "Executed",
    inputs: [
      { indexed: true, internalType: "bytes32", name: "callHash", type: "bytes32" },
      { indexed: true, internalType: "address", name: "sponsor", type: "address" },
      { indexed: true, internalType: "address", name: "eoa", type: "address" }
    ]
  },
  {
    type: "error",
    name: "OnlySponsor",
    inputs: []
  },
  {
    type: "error",
    name: "BadMsgValue",
    inputs: []
  },
  {
    type: "error",
    name: "InvalidCallHash",
    inputs: [
      { internalType: "bytes32", name: "expected", type: "bytes32" },
      { internalType: "bytes32", name: "got", type: "bytes32" }
    ]
  },
  {
    type: "error",
    name: "SubcallFailed",
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bytes", name: "revertData", type: "bytes" }
    ]
  },
  {
    type: "receive",
    stateMutability: "payable"
  }
] as const;
