import { NextUIProvider } from '@nextui-org/react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import React from 'react';

import { Web3Provider } from '@/providers/Web3';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Provider>
      <NextUIProvider>{children}</NextUIProvider>
    </Web3Provider>
  );
};

const customRender: (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => ReturnType<typeof render> = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
