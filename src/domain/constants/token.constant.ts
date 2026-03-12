export const TOKENS = ["JPYC", "USDC", "EURC"] as const;
export type Token = (typeof TOKENS)[number];
