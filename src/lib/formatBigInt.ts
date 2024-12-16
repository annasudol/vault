import { formatUnits } from 'viem';

export function formatBigInt(decimals: number, value?: bigint): string {
  return formatUnits(value || 0n, decimals);
}
