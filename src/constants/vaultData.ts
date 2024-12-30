import type { StaticData } from '@/types';
import { ChainName, TokenSymbol } from '@/types';

export const vaultData: StaticData[] = [
  {
    vaultAddress: '0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723',
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.WETH, TokenSymbol.rETH],
  },
  {
    vaultAddress: '0xf06fda2664d1f88d19919e37034b92bf26896c61',
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.wstETH, TokenSymbol.WETH],
  },
];
