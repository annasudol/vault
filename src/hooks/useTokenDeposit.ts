import { useCallback, useEffect, useState } from 'react';

import type { TokenBalance, TokenDeposit, TokensCollection } from '@/types';

export const useTokenDeposit = (
  tokenRatio?: number,
  tokenBalance?: TokensCollection<TokenBalance>,
) => {
  const [tokenDeposit, setTokenDeposit] =
    useState<TokensCollection<TokenDeposit>>();

  const [balanceIsNotSufficient, setBalanceIsNotSufficient] = useState(false);
  useEffect(() => {
    if (!tokenBalance) {
      return;
    }
    const balances = Object.values(tokenBalance);
    setBalanceIsNotSufficient(
      balances.some((balance) => balance.balanceInt === '0'),
    );
  }, [tokenBalance, setBalanceIsNotSufficient]);

  const calculateDepositValue = useCallback(() => {
    if (tokenBalance && tokenRatio) {
      const token0Balances = Number(
        Object.values(tokenBalance as TokensCollection<TokenBalance>)[0]
          ?.balanceInt,
      );
      const token1Balances = Object.values(
        tokenBalance as TokensCollection<TokenBalance>,
      )[1]?.balanceInt;

      const depositValues = Object.entries(tokenBalance).reduce(
        (
          acc: {
            [key: string]: {
              depositValue: string;
              maxDepositValue: number;
            };
          },
          [token],
          index,
        ) => {
          acc[token] = {
            depositValue: acc[token]?.depositValue || '0',
            maxDepositValue:
              index === 0
                ? Number(token0Balances) / tokenRatio
                : Number(token1Balances),
          };
          return acc;
        },
        {},
      );
      return depositValues;
    }
    return {};
  }, []);

  useEffect(() => {
    setTokenDeposit(calculateDepositValue());
  }, [calculateDepositValue]);

  return {
    tokenDeposit,
    setTokenDeposit,
    balanceIsNotSufficient,
  };
};
