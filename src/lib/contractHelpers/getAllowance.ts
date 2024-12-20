import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { Address, AsyncResponse } from '@/types';
import { ResponseStatus } from '@/types';

import { formatBigInt } from '../formatBigInt';

export async function readAllowance(
  user: Address,
  token: Address,
  decimals: number,
): Promise<AsyncResponse<string>> {
  try {
    const balance = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: token,
      functionName: 'allowance',
      args: [user, CONTRACT_ADDRESS.ROUTER],
    });

    return {
      status: ResponseStatus.Success,
      data: formatBigInt(balance, decimals),
    };
  } catch (e) {
    return {
      status: ResponseStatus.Error,
      message: 'Error when read allowance',
    };
  }
}
