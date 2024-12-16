import type { Address } from 'viem';
import { isAddress } from 'viem';
import { create } from 'zustand';

import { getTokenBalance } from '@/lib/getTokenBalance';
import { readVaultData } from '@/lib/readVaultData';
import type {
  Response,
  TokenBalance,
  TokenKeySymbol,
  VaultData,
} from '@/types';
import { ResponseStatus } from '@/types';

interface Store {
  vault: Response<VaultData>;
  fetchVaultData: (vaultAddress?: string) => Promise<void>;

  tokenBalance: Response<TokenBalance>;
  fetchTokenBalance: (
    waletAddress: Address,
    TokenKeySymbol: TokenKeySymbol,
  ) => Promise<void>;
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

  tokenBalance: { status: ResponseStatus.Pending, data: {} as TokenBalance },
  fetchTokenBalance: async (walletAddress, tokens) => {
    if (!tokens) {
      set({
        tokenBalance: {
          status: ResponseStatus.Error,
          message: 'Tokens are undefined.',
        },
      });
      return;
    }

    const tokenValues = Object.values(tokens);
    if (tokenValues && tokenValues[0] && tokenValues[1]) {
      const [token0, token1] = await Promise.all([
        getTokenBalance(walletAddress, tokenValues[0].address),
        getTokenBalance(walletAddress, tokenValues[1].address),
      ]);
      const data: TokenBalance = {
        [tokenValues[0].symbol]:
          token0.status === ResponseStatus.Success ? token0.data : undefined,
        [tokenValues[1].symbol]:
          token1.status === ResponseStatus.Success ? token1.data : undefined,
      };
      set({
        tokenBalance: {
          status: ResponseStatus.Success,
          data,
        },
      });
    } else {
      set({
        tokenBalance: {
          status: ResponseStatus.Error,
          message: 'Token values are invalid.',
        },
      });
    }
  },
}));
