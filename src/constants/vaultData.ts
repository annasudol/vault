import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { StaticData } from '@/types';
import { ChainName, TokenSymbol } from '@/types';

export const vaultData: StaticData[] = [
  {
    vaultAddress: CONTRACT_ADDRESS.VAULT,
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.WETH, TokenSymbol.rETH],
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
  {
    vaultAddress: '0xf06fda2664d1f88d19919e37034b92bf26896c61',
    chain: ChainName.Arbitrum,
    tokens: [TokenSymbol.wstETH, TokenSymbol.WETH],
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
