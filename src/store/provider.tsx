'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { type CounterStore, createCounterStore } from './contractStore';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const ContractStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const ContractStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCounterStore();
  }

  return (
    <ContractStoreContext.Provider value={storeRef.current}>
      {children}
    </ContractStoreContext.Provider>
  );
};

export const useContractStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(ContractStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useContractStore must be used within ContractStoreProvider`,
    );
  }

  return useStore(counterStoreContext, selector);
};
