import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { arbitrum } from 'viem/chains';

import { AppConfig } from './AppConfig';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = getDefaultConfig({
  appName: AppConfig.site_name,
  projectId: WALLETCONNECT_PROJECT_ID as string,
  chains: [arbitrum],
  ssr: true,
  transports: {
    [arbitrum.id]: http(
      'https://virtual.arbitrum.rpc.tenderly.co/1b051119-4056-4941-91f6-05b4163666f4',
    ),
  },
});
