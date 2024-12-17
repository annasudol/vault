import '../styles/global.css';

import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { Web3Provider } from '@/providers/Web3';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Web3Provider>
    <NextUIProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </NextUIProvider>
  </Web3Provider>
);

export default MyApp;
