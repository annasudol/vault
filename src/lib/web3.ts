import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from '@wagmi/core';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { arbitrum } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

import { AppConfig } from '@/config/AppConfig';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const WALLET_CONNECT_CONFIG = defaultWagmiConfig({
  projectId: WALLETCONNECT_PROJECT_ID as string,
  chains: [arbitrum],
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

export const wagmiConfig = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL),
  },
  ssr: true,
});
