import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum } from 'viem/chains';

import { AppConfig } from './AppConfig';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = getDefaultConfig({
  appName: AppConfig.site_name,
  projectId: WALLETCONNECT_PROJECT_ID as string,
  chains: [arbitrum],
  ssr: true,
});
