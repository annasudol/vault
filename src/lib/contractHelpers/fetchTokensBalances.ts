import { readContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { formatBigInt } from '@/lib/formatBigInt';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type {
  Address,
  AsyncResponse,
  TokenBalance,
  TokenInfo,
  TokensAllBalance,
} from '@/types';
import { ResponseStatus } from '@/types';

const fetchTokenBalanceFromChain = async (
  tokenAddress: Address,
  decimals: number,
  walletAddress: Address,
) => {
  const erc20Config = { abi: erc20Abi } as const;

  const balance = await readContract(WALLET_CONNECT_CONFIG, {
    ...erc20Config,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [walletAddress],
  });
  const balances = {
    balanceInt: Number(formatBigInt(balance, decimals)).toString(),
    balanceBigInt: balance,
  };

  return balances;
};

export const fetchTokensBalances = async (
  tokens: Record<string, TokenInfo>,
  walletAddress: Address,
): Promise<AsyncResponse<TokensAllBalance>> => {
  const tokenEntries = Object.entries(tokens);
  try {
    const balancePromises = tokenEntries.map(([key, token]) =>
      fetchTokenBalanceFromChain(token.address, token.decimals, walletAddress)
        .then(({ balanceInt, balanceBigInt }) => ({
          [key]: {
            balanceInt,
            balanceBigInt,
          },
        }))
        .catch((error) => ({ error })),
    );

    const balancesArray = await Promise.all(balancePromises);
    const balances: Record<string, TokenBalance> = {};

    for (const balance of balancesArray) {
      if ('error' in balance) {
        return {
          status: ResponseStatus.Error,
          message: 'Error when fetching balances',
        };
      }
      Object.assign(balances, balance);
    }

    return {
      status: ResponseStatus.Success,
      data: balances,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error when fetching balances';
    return {
      status: ResponseStatus.Error,
      message: errorMessage,
    };
  }
};
