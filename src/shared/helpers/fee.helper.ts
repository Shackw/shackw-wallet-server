export const calcFeeByBps = (amountMinUnit: bigint, bps: number): bigint => {
  const denom = 10_000n;
  return (amountMinUnit * BigInt(bps) + denom - 1n) / denom;
};
