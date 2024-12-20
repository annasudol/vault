'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import type { PropsWithChildren } from 'react';
import type { State } from 'wagmi';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig, WALLETCONNECT_PROJECT_ID } from '@/config/web3';

interface Props extends PropsWithChildren {
  initialState?: State;
}

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig,
  projectId: WALLETCONNECT_PROJECT_ID as string,
  enableAnalytics: false,
  enableOnramp: true,
});

export function Web3Provider(props: Props) {
  return (
    <>
      <WagmiProvider config={wagmiConfig} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{props.children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
