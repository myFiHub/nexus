export function bigIntCoinToMoveOnAptos(v: bigint | number | string): number {
  const weiToEthRatio = BigInt(10) ** BigInt(8);
  const vInEth = Number(v) / Number(weiToEthRatio);
  return vInEth;
}

export function doubleToBigIntMoveForAptos(v: number): bigint {
  const weiToEthRatio = BigInt(10) ** BigInt(8);
  const vInWei = BigInt(Math.floor(v * Number(weiToEthRatio)));
  return vInWei;
}
