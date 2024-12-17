import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { CONTRACT } from '@/lib/static/contractAddress';
import type { Address, Response, TokenCollection } from '@/types';
import { ResponseStatus } from '@/types';

import { wagmiConfig } from './web3';

export async function readAllowance(
  user: Address,
  token: Address,
): Promise<Response<bigint>> {
  const erc20Config = { abi: erc20Abi } as const;
  try {
    const balance = await readContract(wagmiConfig, {
      ...erc20Config,
      address: token,
      functionName: 'allowance',
      args: [user, CONTRACT.ROUTER as Address],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch (e) {
    return { status: ResponseStatus.Error };
  }
}

export async function getAllAllowance(
  address: Address,
  tokens: TokenCollection,
) {
  const allowancePromises = Object.values(tokens).map(async (token) => {
    const allowance = await readAllowance(address, token.address);
    return {
      [token.symbol]: allowance,
    };
  });

  const allowanceResponse = await Promise.all(allowancePromises);
  const allowanceByTokenSymbol = allowanceResponse.reduce<{
    [key: string]: bigint | ResponseStatus;
  }>((acc, res) => {
    const response = Object.values(res)[0];

    const status = response?.status;
    const key = Object.keys(res)[0];
    if (status === ResponseStatus.Error) {
      return { status: ResponseStatus.Error };
    }
    if (status === ResponseStatus.Success) {
      const data = response?.data;
      if (data) {
        // const allowanceInt = formatBigInt(data, response?.decimals);
        return { ...acc, [key as string]: data };
      }
    }
    return acc;
  }, {});
  return allowanceByTokenSymbol;
}
