import type { StaticData } from '@/types';
import { ChainName, TokenSymbol } from '@/types';

export const vaultData: StaticData[] = [
  {
    vaultAddress: '0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723',
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.WETH, TokenSymbol.rETH],
  }
];
