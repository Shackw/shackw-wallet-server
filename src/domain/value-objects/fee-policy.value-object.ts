import { ExchangeRate } from "@/application/ports/exchanges.gateway.interface";
import { Token, TOKEN_REGISTRY } from "@/registries/token.registry";

import { AmountUnit } from "../entities/common/amount-unit.entity";

type BpsWithCapPolicy = {
  method: "bps_with_cap";
  version: "v1";
  bps: bigint;
  cap: AmountUnit;
  quantumUnits: bigint;
};

export type FeeWithPolicy = { fee: AmountUnit; policy: BpsWithCapPolicy };

export class FeeValueObject {
  private constructor(
    private readonly bps: bigint,
    private readonly capMinUnits: bigint,
    private readonly quantumUnits: bigint
  ) {}

  static create(bps: bigint, capMinUnits: bigint, quantumUnits: bigint): FeeValueObject {
    return new FeeValueObject(bps, capMinUnits, quantumUnits);
  }

  apply(amount: bigint, sendToken: Token, feeToken: Token, exchangeRate: ExchangeRate): FeeWithPolicy {
    const sendBaseUnit = TOKEN_REGISTRY[sendToken].baseUnit;
    const feeBaseUnit = TOKEN_REGISTRY[feeToken].baseUnit;

    const amountInFeeTokenUnits = (amount * exchangeRate.rate * feeBaseUnit) / (exchangeRate.unit * sendBaseUnit);

    let rawFeeUnits = (amountInFeeTokenUnits * this.bps) / 10_000n;
    if (this.quantumUnits > 1n) rawFeeUnits = (rawFeeUnits / this.quantumUnits) * this.quantumUnits;

    const cappedFeeUnits = rawFeeUnits > this.capMinUnits ? this.capMinUnits : rawFeeUnits;

    return {
      fee: {
        symbol: feeToken,
        minUnits: cappedFeeUnits,
        decimals: TOKEN_REGISTRY[feeToken].decimals
      },
      policy: {
        method: "bps_with_cap",
        version: "v1",
        bps: this.bps,
        cap: {
          symbol: feeToken,
          minUnits: this.capMinUnits,
          decimals: TOKEN_REGISTRY[feeToken].decimals
        },
        quantumUnits: this.quantumUnits
      }
    };
  }
}
