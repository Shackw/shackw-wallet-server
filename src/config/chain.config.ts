export type Chain = (typeof CHAIN_KEYS)[number];

export const CHAIN_KEYS = ["mainnet", "base", "polygon", "sepolia", "baseSepolia", "polygonAmoy"] as const;
