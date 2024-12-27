import { useEffect, useState } from 'react';

import { useStore } from '@/store/store';
import type {
  Address,
  TokenBalance,
  TokenDeposit,
  TokensCollection,
} from '@/types';

export const useTokenRatio = (
  vaultAddress: Address,
  tokenBalance?: TokensCollection<TokenBalance>,
) => {
  const { vaults } = useStore();
  const [tokenRatio, setTokenRatio] = useState<number>();
  const [vault] = useState(vaults[vaultAddress]);

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

  useEffect(() => {
    function getHighestBalance(obj: TokensCollection<TokenBalance>) {
      let highest = null; // To store the highest balance object
      let highestKey = null; // To store the key of the highest balance object

      for (const [key, value] of Object.entries(obj)) {
        const currentBalance = parseFloat(value.balanceInt || '0'); // Convert balanceInt to a number for comparison
        if (
          !highest ||
          currentBalance > parseFloat(highest.balanceInt || '0')
        ) {
          highest = value; // Update the highest balance object
          highestKey = key; // Update the key
        }
      }

      return highestKey ? { [highestKey]: highest } : {}; // Return the key and its associated object
    }
    if (tokenBalance && tokenBalance && !balanceIsNotSufficient) {
      const totalUnderlying = vault?.totalUnderlying;

      if (totalUnderlying) {
        const ratioBN = totalUnderlying[1] / totalUnderlying[0];
        const ratio = Number(ratioBN);
        setTokenRatio(ratio);
        const tokenMaxDepositValue = getHighestBalance(tokenBalance);

        const depositValue = Object.entries(tokenBalance).reduce(
          (
            acc: {
              [key: string]: {
                depositValue: string;
                maxDepositValue: number;
              };
            },
            [t, balance],
          ) => {
            if (t === Object.keys(tokenMaxDepositValue)[0]) {
              acc[t] = {
                depositValue: '0',
                maxDepositValue: Number(balance.balanceInt) / ratio,
              };
              return acc;
            }
            acc[t] = {
              depositValue: '0',
              maxDepositValue: Number(balance.balanceInt) * ratio,
            };
            return acc;
          },
          {},
        );
        setTokenDeposit(depositValue);
      }
    }
  }, []);
  return {
    tokenRatio,
    tokenDeposit,
    setTokenDeposit,
    balanceIsNotSufficient,
  };
};
