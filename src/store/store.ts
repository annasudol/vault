import type { Address } from 'viem';
import { isAddress } from 'viem';
import { create } from 'zustand';

import { fetchTokensBalances } from '@/lib/contractHelpers/fetchTokensBalances';
import { readVaultData } from '@/lib/contractHelpers/readVaultData';
import type { DepositSubmitData, Response, VaultData } from '@/types';
import { ResponseStatus, StepType } from '@/types';

interface Store {
  vault: Response<VaultData>;
  fetchVaultData: (vaultAddress?: string) => Promise<void>;
  fetchTokenBalance: (waletAddress: Address) => Promise<void>;

  step: StepType;
  changeStep: (step: StepType) => void;

  depositValue?: DepositSubmitData;
  setDepositValue: (value: DepositSubmitData) => void;

  // currentAllowance: Response<AllowanceToken>;
  // setCurrentAllowance: (value: Address) => void;
}

export const useStore = create<Store>((set, get) => ({
  vault: { status: ResponseStatus.Pending },

  fetchVaultData: async (vaultAddress) => {
    if (vaultAddress && !isAddress(vaultAddress)) {
      set({
        vault: {
          status: ResponseStatus.Error,
          message: `The token address ${vaultAddress} is invalid.`,
        },
      });
      return;
    }

    try {
      const result = await readVaultData(vaultAddress as Address);
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

  // currentAllowance: { status: ResponseStatus.Pending },
  // setCurrentAllowance: async (address: Address) => {
  //   const { vault } = get();
  //   if (vault.status === ResponseStatus.Success && vault.data) {
  //     const allowancePromises = Object.values(vault.data.tokens).map(
  //       async (token) => {
  //         const allowance = await readAllowance(
  //           address,
  //           CONTRACT_ADDRESS.ROUTER as Address,
  //           token.address,
  //         );

  //         return {
  //           [token.symbol]: allowance,
  //         };
  //       },
  //     );
  //     const allowance = await Promise.all(allowancePromises);

  //     // set({
  //     //   currentAllowance: {
  //     //     status: ResponseStatus.Success,
  //     //     data: {
  //     //       WETH: { status: ResponseStatus.Success, data: allowance[0].data },
  //     //       rETH: { status: ResponseStatus.Success, data: allowance[1].data },
  //     //     },
  //     //   },
  //     // });
  //   }
  //   // set({ currentAllowance: { status: ResponseStatus.Success, data: value } });
  // },
}));
