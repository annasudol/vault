import { readContracts } from '@wagmi/core';

import { helperABI } from '@/abi/helperABI';
import { vaultABI } from '@/abi/valutABI';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { readERC20 } from '@/lib/contractHelpers/readERC20';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type { Address, AsyncResponse, VaultData } from '@/types';
import { ResponseStatus } from '@/types';

export async function readVaultData(
  vaultAddress: Address,
): Promise<AsyncResponse<VaultData>> {
  const vaultContract = {
    abi: vaultABI,
    address: vaultAddress,
  } as const;

  const helperContract = {
    abi: helperABI,
    address: CONTRACT_ADDRESS.HELPER,
  } as const;

  try {
    const reponseContract = await readContracts(WALLET_CONNECT_CONFIG, {
      contracts: [
        {
          ...vaultContract,
          functionName: 'name',
        },
        {
          ...vaultContract,
          functionName: 'totalSupply',
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

    if (
      Object.values(reponseContract).some(
        (response) => response.status === 'failure',
      )
    ) {
      console.log('Failed to fetch data');

      return { status: ResponseStatus.Error, message: 'Failed to fetch data' };
    }

    const [token0, token1] = await Promise.all([
      readERC20(reponseContract[2].result as Address),
      readERC20(reponseContract[3].result as Address),
    ]);

    const name = reponseContract[0].result as string;
    const totalSupply = reponseContract[1].result || 0n;

    return {
      status: ResponseStatus.Success,
      data: {
        contractName: name,
        totalSupply,
        totalUnderlying: reponseContract[4].result as [bigint, bigint],
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
