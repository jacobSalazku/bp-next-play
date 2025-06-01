export function roundToDecimal(num: number, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
