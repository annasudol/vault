import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { CONTRACT_ADDRESS } from '@/constants/contract';
import { formatBigInt } from '@/lib/formatBigInt';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type {
  Address,
  AsyncResponse,
  TokenAllowance,
  TokenInfo,
  TokensCollection,
} from '@/types';
import { ResponseStatus } from '@/types';

export async function readAllowance(
  user: Address,
  token: Address,
): Promise<AsyncResponse<bigint>> {
  try {
    const balance = await readContract(WALLET_CONNECT_CONFIG, {
      abi: erc20Abi,
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
  tokens: TokensCollection<TokenInfo>,
): Promise<AsyncResponse<TokensCollection<TokenAllowance>>> {
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
    return {
      status: ResponseStatus.Error,
      message: 'Error when read allowance',
    };
  });

  const allowanceResponse = await Promise.all(allowancePromises);

  const aggregatedResult = allowanceResponse.reduce((acc, curr) => {
    if (curr.status === ResponseStatus.Success && curr.result) {
      return { ...acc, ...curr.result };
    }
    return acc;
  }, {} as TokensCollection<TokenAllowance>);

  return {
    status: ResponseStatus.Success,
    data: aggregatedResult,
  };
}
