import type { Address } from 'viem';
import { create } from 'zustand';

import { fetchTokensBalances } from '@/lib/contractHelpers/fetchTokensBalances';
import { readVaultData } from '@/lib/contractHelpers/readVaultData';
import type {
  AsyncResponse,
  TokenBalance,
  TokensCollection,
  VaultData,
} from '@/types';
import { ResponseStatus, StepType } from '@/types';

interface Store {
  vault: AsyncResponse<VaultData>;
  fetchVaultData: (vaultAddress: Address) => Promise<void>;

  tokenBalance: AsyncResponse<TokensCollection<TokenBalance>>;
  fetchTokenBalance: (waletAddress: Address) => Promise<void>;

  step: StepType;
  changeStep: (step: StepType) => void;

  depositValue?: TokensCollection<string>;
  setDepositValue: (value: TokensCollection<string>) => void;
}

export const useStore = create<Store>((set, get) => ({
  vault: { status: ResponseStatus.Pending },

  fetchVaultData: async (vaultAddress) => {
    try {
      const result = await readVaultData(vaultAddress);
      set({
        vault: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch data.';
      set({
        vault: {
          status: ResponseStatus.Error,
          message: errorMessage,
        },
      });
    }
  },

  tokenBalance: { status: ResponseStatus.Pending },

  fetchTokenBalance: async (walletAddress) => {
    const { vault } = get();
    if (vault.status === ResponseStatus.Success) {
      const tokens = vault.data?.tokens;

      try {
        const updatedValultWithBalance = await fetchTokensBalances(
          tokens,
          walletAddress,
        );
        set({
          tokenBalance: updatedValultWithBalance,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to get token balance';
        set({
          tokenBalance: {
            status: ResponseStatus.Error,
            message: errorMessage,
          },
        });
      }
    }
  },

  step: StepType.Deposit,
  changeStep: (step: StepType) => {
    set({ step });
  },
  depositValue: undefined,
  setDepositValue: (value: TokensCollection<string>) => {
    set({ depositValue: value });
  },
}));
