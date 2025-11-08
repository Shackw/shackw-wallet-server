import { SupportChain } from "@/config/chain.config";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { ChainByToken, Token, TOKEN_REGISTRY } from "@/registries/token-chain.registry";

import { AmountUnit } from "../entities/common/amount-unit.entity";

type FixedByChainPolicy<C extends SupportChain> = {
  method: "fixed_by_chain";
  version: "v1";
  chain: C;
};

export type FeeWithPolicy<C extends SupportChain = SupportChain> = {
  fee: AmountUnit;
  policy: FixedByChainPolicy<C>;
};

export class FeeValueObject<T extends Token, C extends ChainByToken<T> & SupportChain> {
  private constructor(
    private readonly chain: C,
    private readonly token: T
  ) {}

  static create<T extends Token, C extends ChainByToken<T> & SupportChain>(chain: C, token: T): FeeValueObject<T, C> {
    return new FeeValueObject(chain, token);
  }

  apply(): FeeWithPolicy<C> {
    const { chain, token } = this;
    return {
      fee: {
        symbol: token,
        minUnits: FEE_REGISTORY[chain][token].fixedFeeAmountUnits,
        decimals: TOKEN_REGISTRY[token].decimals
      },
      policy: {
        method: "fixed_by_chain",
        version: "v1",
        chain
      }
    };
  }
}
