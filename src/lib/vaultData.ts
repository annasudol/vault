import type { StaticData } from '@/types';
import { ChainName, TokenSymbol } from '@/types';

const vaultAddress = '0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723';

export const vaultData: StaticData[] = [
  {
    vaultAddress,
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.WETH, TokenSymbol.RETH],
    stats: {
      TVL: {
        title: '$5.78M',
      },
      APY: {
        title: '0.12%',
      },
      volume30d: {
        title: '$45.71M',
      },
      volueme1d: {
        title: '0.28',
      },
    },
  },
];
