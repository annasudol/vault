import type { Address } from 'viem';
import { isAddress } from 'viem';
import { create } from 'zustand';

import { readVaultData } from '@/lib/readVaultData';
import type { Response, VaultData } from '@/types';
import { ResponseStatus } from '@/types';

interface Store {
  vault: Response<VaultData>;
  fetchVaultData: (vaultAddress?: string) => Promise<void>;
  resetResponse: () => void;
}

export const useStore = create<Store>((set) => ({
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

  resetResponse: () =>
    set({
      vault: { status: ResponseStatus.Pending },
    }),
}));
