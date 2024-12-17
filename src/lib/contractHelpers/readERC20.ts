import { readContracts } from '@wagmi/core';
import { erc20Abi } from 'viem';

import type { Address, AsyncResponse, TokenInfo } from '@/types';
import { ResponseStatus } from '@/types';

import { wagmiConfig } from '../web3';

export async function readERC20(
  tokenAddress: Address,
): Promise<AsyncResponse<TokenInfo>> {
  const erc20Config = { abi: erc20Abi } as const;

  try {
    const tokensData = await readContracts(wagmiConfig, {
      contracts: [
        {
          ...erc20Config,
          address: tokenAddress,
          functionName: 'symbol',
        },
        {
          ...erc20Config,
          address: tokenAddress,
          functionName: 'decimals',
        },
        {
          ...erc20Config,
          address: tokenAddress,
          functionName: 'name',
        },
      ],
    });

    if (Object.values(tokensData).some((res) => res.status === 'failure')) {
      return { status: ResponseStatus.Error };
    }

    return {
      status: ResponseStatus.Success,
      data: {
        address: tokenAddress,
        symbol: tokensData[0].result!,
        name: tokensData[2].result!,
        decimals: tokensData[1].result!,
      },
    };
  } catch {
    return { status: ResponseStatus.Error };
  }
}
