import type { Address } from 'viem';
import { create } from 'zustand';

import type {
  DepositTokens,
  TokenBalance,
  TokensCollection,
  VaultCollection,
  VaultData,
} from '@/types';
import { StepType } from '@/types';

interface Store {
  vaults: VaultCollection<VaultData>;
  saveVaultData: (vaultAddress: Address, vault: VaultData) => void;
  tokenBalance: VaultCollection<TokensCollection<TokenBalance>>;

  saveTokenBalance: (
    vaultAddress: Address,
    balance: TokensCollection<TokenBalance>,
  ) => void;

  step: StepType;
  changeStep: (step: StepType) => void;

  depositValue?: DepositTokens;
  setDepositValue: (value: DepositTokens) => void;
}

export const useStore = create<Store>((set) => ({
  vaults: {},
  saveVaultData: (vaultAddress, vault) => {
    set((state) => ({
      vaults: {
        ...state.vaults,
        [vaultAddress]: vault,
      },
    }));
  },

  tokenBalance: {},
  saveTokenBalance: (vaultAddress, balance) => {
    set((state) => ({
      tokenBalance: {
        ...state.tokenBalance,
        [vaultAddress]: balance,
      },
    }));
  },

  step: StepType.Deposit,
  changeStep: (step: StepType) => {
    set({ step });
  },

  depositValue: undefined,
  setDepositValue: (value: DepositTokens) => {
    set({ depositValue: value });
  },
}));
