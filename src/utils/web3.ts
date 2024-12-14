import { createConfig, http } from '@wagmi/core';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { bscTestnet, sepolia } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

import { AppConfig } from './AppConfig';
import { ETH_CHAINS } from './network';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!WALLETCONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

export const WALLET_CONNECT_CONFIG = defaultWagmiConfig({
  projectId: WALLETCONNECT_PROJECT_ID as string,
  chains: ETH_CHAINS,
  ssr: true,
  metadata: {
    name: AppConfig.site_name,
    description: AppConfig.description,
    url: AppConfig.url,
    icons: [],
  },
  auth: {
    socials: undefined,
    showWallets: true,
    walletFeatures: true,
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const config = createConfig({
  chains: [bscTestnet, sepolia],
  transports: {
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
  },
});
