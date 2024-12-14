'use client';

import '@rainbow-me/rainbowkit/styles.css';

import type { Theme } from '@rainbow-me/rainbowkit';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import _ from 'lodash';
import type { PropsWithChildren } from 'react';
import type { State } from 'wagmi';
import { WagmiProvider } from 'wagmi';

import { WALLET_CONNECT_CONFIG, WALLETCONNECT_PROJECT_ID } from '@/utils/web3';

interface Props extends PropsWithChildren {
  initialState?: State;
}

const myTheme = _.merge(darkTheme(), {
  colors: {
    accentColor: '##21a378',
  },
} as Theme);

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: WALLET_CONNECT_CONFIG,
  projectId: WALLETCONNECT_PROJECT_ID as string,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: true,
});

export function Web3Provider(props: Props) {
  return (
    <>
      <WagmiProvider
        config={WALLET_CONNECT_CONFIG}
        initialState={props.initialState}
      >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={myTheme}>
            {props.children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
