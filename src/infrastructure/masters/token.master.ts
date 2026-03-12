import type { Currency } from "@/domain/constants/currency.constant";
import type { Token } from "@/domain/constants/token.constant";

export type TokenMasterEntry = {
  currency: Currency;
  decimals: number;
};

export type TokenMaster = Record<Token, TokenMasterEntry>;

export const TOKEN_MASTER = {
  JPYC: {
    currency: "JPY",
    decimals: 18
  },
  USDC: {
    currency: "USD",
    decimals: 6
  },
  EURC: {
    currency: "EUR",
    decimals: 6
  }
} as const satisfies TokenMaster;
