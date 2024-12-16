import { readContract } from '@wagmi/core';
import type { Address } from 'viem';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/lib/web3';
import type { Response } from '@/types';
import { ResponseStatus } from '@/types';

export async function getTokenBalance(
  walletAddress: Address,
  tokenAddress: Address,
): Promise<Response<bigint>> {
  const erc20Config = { abi: erc20Abi } as const;

  try {
    const balance = await readContract(wagmiConfig, {
      ...erc20Config,
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
