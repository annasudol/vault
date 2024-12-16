import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import type { Address, Response } from '@/types';
import { ResponseStatus } from '@/types';

import { wagmiConfig } from './web3';

export async function getAllowance(
  user: Address,
  spender: Address,
  token: Address,
): Promise<Response<bigint>> {
  const erc20Config = { abi: erc20Abi } as const;
  try {
    const balance = await readContract(wagmiConfig, {
      ...erc20Config,
      address: token,
      functionName: 'allowance',
      args: [user, spender],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch (e) {
    return { status: ResponseStatus.Error };
  }
}
