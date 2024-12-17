import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { formatBigInt } from '@/lib/formatBigInt';
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
): Promise<{
  status: ResponseStatus;
  result:
    | {
        [x: string]: {
          allowanceInt: string;
          allowanceBigInt: bigint;
        };
      }
    | undefined;
}> {
  const allowancePromises = Object.values(tokens).map(async (token) => {
    const allowance = await readAllowance(address, token.address);
    if (allowance.status === ResponseStatus.Success && allowance.data) {
      return {
        status: ResponseStatus.Success,
        result: {
          [token.symbol]: {
            allowanceInt: formatBigInt(allowance.data, token.decimals),
            allowanceBigInt: allowance.data,
          },
        },
      };
    }
    return { status: ResponseStatus.Error, result: undefined };
  });

  const allowanceResponse = await Promise.all(allowancePromises);

  const aggregatedResult = allowanceResponse.reduce(
    (acc, curr) => {
      if (curr.status === ResponseStatus.Success && curr.result) {
        acc.result = { ...acc.result, ...curr.result };
      }
      return acc;
    },
    { status: ResponseStatus.Success, result: undefined },
  );

  return aggregatedResult;
}
