import type { Chain } from 'viem/chains';
import { bscTestnet, sepolia } from 'viem/chains';

const chains = [bscTestnet, sepolia] as [Chain, ...Chain[]];
export const ETH_CHAINS = chains;
