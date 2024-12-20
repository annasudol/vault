import { useCallback, useEffect, useState } from 'react';

import { useStore } from '@/store/store';
import type {
  Address,
  TokenBalance,
  TokenDeposit,
  TokensCollection,
} from '@/types';
import { TokenSymbol } from '@/types';

export const useTokenRatio = (address: string | undefined) => {
  const { vault, fetchTokenBalance, tokenBalance } = useStore();
  const [tokenRatio, setTokenRatio] = useState<number>();
  const [tokensAllBalance, setTokensAllBalance] =
    useState<TokensCollection<TokenBalance>>();

  const [tokenDeposit, setTokenDeposit] =
    useState<TokensCollection<TokenDeposit>>();
  const [balanceIsNotSufficient, setBalanceIsNotSufficient] = useState(false);
  const handleFetchTokenBalance = useCallback(() => {
    if (!address) {
      return;
    }
    fetchTokenBalance(address as Address);
  }, [address, fetchTokenBalance]);

  useEffect(() => {
    handleFetchTokenBalance();
  }, [address, fetchTokenBalance]);

  useEffect(() => {
    if (
      vault.status === 'success' &&
      'data' in vault &&
      tokenBalance.status === 'success' &&
      'data' in tokenBalance
    ) {
      const tokenBalanceData = tokenBalance.data;
      setTokensAllBalance(tokenBalanceData);

      const balances = Object.values(tokenBalanceData);
      if (balances.some((balance) => balance.balanceInt === '0')) {
        setBalanceIsNotSufficient(true);
      } else {
        const { totalUnderlying } = vault.data;
        setBalanceIsNotSufficient(false);

        if (totalUnderlying) {
          const ratioBN = totalUnderlying[1] / totalUnderlying[0];
          const ratio = Number(ratioBN);
          setTokenRatio(ratio);

          const depositValue = Object.keys(tokenBalanceData).reduce(
            (acc, token) => {
              const balance0Token =
                Number(tokenBalanceData[TokenSymbol.rETH]?.balanceInt || 0) /
                ratio;
              return {
                ...acc,
                [token]: {
                  depositValue: '0',
                  maxDepositValue:
                    token === TokenSymbol.WETH
                      ? balance0Token
                      : Number(tokenBalanceData.rETH?.balanceInt),
                },
              };
            },
            {},
          );
          setTokenDeposit(depositValue);
        }
      }
    }
  }, [vault, tokenBalance]);

  return {
    tokenRatio,
    tokensAllBalance,
    tokenDeposit,
    setTokenDeposit,
    balanceIsNotSufficient,
  };
};
