import { readContract } from '@wagmi/core';
import type { Address } from 'viem';

import { erc20Abi } from '@/abi/erc20ABI';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type { AsyncResponse } from '@/types';
import { ResponseStatus } from '@/types';

export async function getTokenBalance(
  walletAddress: Address,
  tokenAddress: Address,
): Promise<AsyncResponse<bigint>> {
  try {
    const balance = await readContract(WALLET_CONNECT_CONFIG, {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: 'balanceOf',
      args: [walletAddress],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch {
    return { status: ResponseStatus.Error };
  }
}
