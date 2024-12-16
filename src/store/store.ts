import type { Address } from 'viem';
import { isAddress } from 'viem';
import { create } from 'zustand';

import { fetchTokensBalances } from '@/lib/fetchTokensBalances';
import { readVaultData } from '@/lib/readVaultData';
import type { Response, VaultData } from '@/types';
import { ResponseStatus } from '@/types';

interface Store {
  vault: Response<VaultData>;
  fetchVaultData: (vaultAddress?: string) => Promise<void>;
  fetchTokenBalance: (waletAddress: Address) => Promise<void>;
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
}));
