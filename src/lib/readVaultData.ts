import { readContracts } from '@wagmi/core';
import type { Address } from 'viem';

import { vaultABI } from '@/abi/valutABI';
import type { Response } from '@/types';
import { ResponseStatus } from '@/types';

import { wagmiConfig } from './web3';

export interface VaultData {
  name: string;
  totalSupply?: BigInt;
  token0?: Address;
  token1?: Address;
}

export async function readVaultData(
  vaultAddress: Address,
): Promise<Response<VaultData>> {
  const vaultContract = {
    abi: vaultABI,
    address: vaultAddress,
  } as const;

  try {
    const reponseContract = await readContracts(wagmiConfig, {
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
      ],
    });
    if (
      Object.values(reponseContract).some(
        (response) => response.status === 'failure',
      )
    ) {
      return { status: ResponseStatus.Error, message: 'Failed to fetch data' };
    }
    const name = reponseContract[0].result as string;
    const totalSupply = reponseContract[1].result;
    const token0 = reponseContract[2].result as Address;
    const token1 = reponseContract[3].result as Address;
    return {
      status: ResponseStatus.Success,
      data: {
        name,
        totalSupply,
        token0,
        token1,
      },
    };
  } catch {
    return {
      status: ResponseStatus.Error,
      message: 'Failed to get data from the contract',
    };
  }
}
