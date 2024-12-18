import { readContracts } from '@wagmi/core';

import { helperABI } from '@/abi/helperABI';
import { vaultABI } from '@/abi/valutABI';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { readERC20 } from '@/lib/contractHelpers/readERC20';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type { Address, AsyncResponse, VaultData } from '@/types';
import { ResponseStatus } from '@/types';

import { truncateString } from '../truncateString';

export async function readVaultData(
  vaultAddress: Address,
): Promise<AsyncResponse<VaultData>> {
  const vaultContract = {
    abi: vaultABI,
    address: vaultAddress,
  };

  const helperContract = {
    abi: helperABI,
    address: CONTRACT_ADDRESS.HELPER,
  };

  try {
    const reponseContract = await readContracts(WALLET_CONNECT_CONFIG, {
      contracts: [
        {
          ...vaultContract,
          functionName: 'name',
        },
        {
          ...vaultContract,
          functionName: 'token0',
        },
        {
          ...vaultContract,
          functionName: 'token1',
        },
        {
          ...helperContract,
          functionName: 'totalUnderlying',
          args: [vaultAddress],
        },
      ],
    });
    const errorResponse = reponseContract.filter(
      (response) => response.status === 'failure',
    );

    if (reponseContract.some((response) => response.status === 'failure')) {
      const errorMessage = errorResponse[0]?.error
        ? truncateString(errorResponse[0].error.toString())
        : 'Failed to read vault contract';
      return {
        status: ResponseStatus.Error,
        message: errorMessage,
      };
    }

    const [token0, token1] = await Promise.all([
      readERC20(reponseContract[1].result as Address),
      readERC20(reponseContract[2].result as Address),
    ]);

    if (token0.status === ResponseStatus.Error) {
      return {
        status: ResponseStatus.Error,
        message: token0.message,
      };
    }
    if (token1.status === ResponseStatus.Error) {
      return {
        status: ResponseStatus.Error,
        message: token1.message,
      };
    }
    const name = reponseContract[0].result as string;

    return {
      status: ResponseStatus.Success,
      data: {
        contractName: name,
        totalUnderlying: reponseContract[3].result as [bigint, bigint],
        tokens: {
          ...(token0.status === ResponseStatus.Success && {
            [token0.data.symbol]: token0.data,
          }),
          ...(token1.status === ResponseStatus.Success && {
            [token1.data.symbol]: token1.data,
          }),
        },
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch data';
    return {
      status: ResponseStatus.Error,
      message: errorMessage,
    };
  }
}
