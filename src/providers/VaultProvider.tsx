import { useParams } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import React, { createContext } from 'react';

import { useReadVaultData } from '@/hooks/useReadVault';
import type {
  CallContractStatus,
  TokenInfo,
  TokensCollection,
  VaultData,
} from '@/types';

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: boolean;
}
export type VaultContextType = {
  vaultAddressIsInvalid: boolean;
  vaultData?: VaultData;
  vaultStatus?: CallContractStatus;
  tokens?: TokensCollection<TokenInfo>;
  tokensStatus: CallContractStatus;
};
export const VaultContext = createContext<VaultContextType | null>(null);

const VaultProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const params = useParams<{ address: string }>();
  const vaultAddress = params?.address;
  const {
    vaultData,
    vaultAddressIsInvalid,
    vaultStatus,
    tokens,
    tokensStatus,
  } = useReadVaultData(vaultAddress);

  return (
    <VaultContext.Provider
      value={{
        vaultAddressIsInvalid,
        vaultData,
        tokens,
        vaultStatus,
        tokensStatus,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export default VaultProvider;
