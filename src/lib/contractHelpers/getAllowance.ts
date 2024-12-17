import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { CONTRACT_ADDRESS } from '@/constants/contract';
import { formatBigInt } from '@/lib/formatBigInt';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type { Address, AsyncResponse, TokenCollection } from '@/types';
import { ResponseStatus } from '@/types';

export async function readAllowance(
  user: Address,
  token: Address,
): Promise<AsyncResponse<bigint>> {
  const erc20Config = { abi: erc20Abi } as const;
  try {
    const balance = await readContract(WALLET_CONNECT_CONFIG, {
      ...erc20Config,
      address: token,
      functionName: 'allowance',
      args: [user, CONTRACT_ADDRESS.ROUTER],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch (e) {
    return {
      status: ResponseStatus.Error,
      message: 'Error when read allowance',
    };
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
