import '../styles/global.css';

import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';

import { Web3Provider } from '@/providers/Web3Provider';
// import { ContractStoreProvider } from '@/store/provider';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Web3Provider>
    {/* <ContractStoreProvider> */}
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
    {/* </ContractStoreProvider> */}
  </Web3Provider>
);

export default MyApp;
