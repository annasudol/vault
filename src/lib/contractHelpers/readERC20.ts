import { readContracts } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { wagmiConfig } from '@/config/web3';
import type { Address, AsyncResponse, TokenInfo } from '@/types';
import { ResponseStatus } from '@/types';

import { truncateString } from '../truncateString';

export async function readERC20(
  tokenAddress: Address,
): Promise<AsyncResponse<TokenInfo>> {
  try {
    const tokensData = await readContracts(wagmiConfig, {
      contracts: [
        {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: 'symbol',
        },
        {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: 'decimals',
        },
        {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: 'name',
        },
      ],
    });

    if (Object.values(tokensData).some((res) => res.status === 'failure')) {
      const errorMessage = Object.values(tokensData)
        .filter((err) => err.status === 'failure')[0]
        ?.error.toString();
      return {
        status: ResponseStatus.Error,
        message:
          truncateString(errorMessage) || 'Failed to read token contract',
      };
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
  } catch (error: Error | unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to read token contract';
    return {
      status: ResponseStatus.Error,
      message,
    };
  }
}
