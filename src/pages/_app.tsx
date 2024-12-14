import '../styles/global.css';

import type { AppProps } from 'next/app';

import { Web3Provider } from '@/providers/Web3';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Web3Provider>
    <Component {...pageProps} />
  </Web3Provider>
);

export default MyApp;
