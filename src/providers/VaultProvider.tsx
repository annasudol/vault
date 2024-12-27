import { useParams } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import React, { createContext, useState } from 'react';

import { useReadVaultData } from '@/hooks/useReadVault';
import type {
  CallContractStatus,
  DepositTokens,
  TokenInfo,
  TokensCollection,
  VaultData,
} from '@/types';
import { StepType } from '@/types';

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

  step: StepType;
  setStep: (step: StepType) => void;

  deposit?: DepositTokens;
  setDeposit: (value: DepositTokens) => void;
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

  const [step, setStep] = useState<StepType>(StepType.Deposit);
  const [deposit, setDeposit] = useState<DepositTokens>();

  return (
    <VaultContext.Provider
      value={{
        vaultAddressIsInvalid,
        vaultData,
        tokens,
        vaultStatus,
        tokensStatus,
        step,
        setStep,
        deposit,
        setDeposit,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export default VaultProvider;
