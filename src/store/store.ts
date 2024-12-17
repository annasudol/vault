import type { Address } from 'viem';
import { create } from 'zustand';

import { fetchTokensBalances } from '@/lib/contractHelpers/fetchTokensBalances';
import { readVaultData } from '@/lib/contractHelpers/readVaultData';
import type { AsyncResponse, DepositSubmitData, VaultData } from '@/types';
import { ResponseStatus, StepType } from '@/types';

interface Store {
  vault: AsyncResponse<VaultData>;
  fetchVaultData: (vaultAddress: Address) => Promise<void>;
  fetchTokenBalance: (waletAddress: Address) => Promise<void>;

  step: StepType;
  changeStep: (step: StepType) => void;

  depositValue?: DepositSubmitData;
  setDepositValue: (value: DepositSubmitData) => void;
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
          vault: {
            status: ResponseStatus.Success,
            data: {
              ...vault.data,
              tokens: updatedValultWithBalance,
            },
          },
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  },

  step: StepType.Deposit,
  changeStep: (step: StepType) => {
    set({ step });
  },
  depositValue: undefined,
  setDepositValue: (value: DepositSubmitData) => {
    set({ depositValue: value });
  },
}));
