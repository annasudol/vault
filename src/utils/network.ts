import type { Chain } from 'viem/chains';
import { arbitrum } from 'viem/chains';

const chains = [arbitrum] as [Chain, ...Chain[]];
export const ETH_CHAINS = chains;
