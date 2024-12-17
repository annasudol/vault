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
];
