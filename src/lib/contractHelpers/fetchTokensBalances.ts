import { readContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/lib/web3';
import type { Address, TokenBalance, TokenInfo } from '@/types';

import { formatBigInt } from './formatBigInt';

const fetchTokenBalanceFromChain = async (
  tokenAddress: Address,
  decimals: number,
  walletAddress: Address,
) => {
  const erc20Config = { abi: erc20Abi } as const;

  const balance = await readContract(wagmiConfig, {
    ...erc20Config,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [walletAddress],
  });
  const balances: TokenBalance = {
    balanceInt: Number(formatBigInt(balance, decimals)).toFixed(4),
    balanceBigInt: balance,
  };

  return balances;
};

export const fetchTokensBalances = async (
  tokens: Record<string, TokenInfo>,
  walletAddress: Address,
) => {
  const tokenEntries = Object.entries(tokens);

  try {
    const balancePromises = tokenEntries.map(([key, token]) =>
      fetchTokenBalanceFromChain(token.address, token.decimals, walletAddress)
        .then(({ balanceInt, balanceBigInt }) => ({
          key,
          balanceInt,
          balanceBigInt,
        }))
        .catch((error) => ({ key, balance: 0n, error })),
    );

    const balances = await Promise.all(balancePromises);
    const updatedTokens = { ...tokens };
    balances.forEach((balance) => {
      if ('error' in balance) {
        throw new Error(`Failed to fetch balance for token ${balance.key}`);
      } else {
        const { key, balanceBigInt, balanceInt } = balance;
        if (updatedTokens[key]) {
          updatedTokens[key] = {
            ...updatedTokens[key],
            balanceInt,
            balanceBigInt,
          };
        }
      }
    });

    return updatedTokens;
  } catch (error) {
    throw new Error('Failed to fetch token balances:');
  }
};
