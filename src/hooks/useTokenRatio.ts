import { useEffect, useState } from 'react';

import { useStore } from '@/store/store';
import type {
  Address,
  TokenBalance,
  TokenDeposit,
  TokensCollection,
} from '@/types';
import { getHighestBalance } from '@/lib/getHighestBalance';

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
    if (tokenBalance && tokenBalance) {
        console.log(tokenBalance, 'balance');


      const balances = Object.values(tokenBalance);
      if (balances.some((balance) => balance.balanceInt === '0')) {
        setBalanceIsNotSufficient(true);

      } else {
        setBalanceIsNotSufficient(false);
        const totalUnderlying = vault?.totalUnderlying;

        if (totalUnderlying) {
         const ratioBN = totalUnderlying[1] / totalUnderlying[0];
          const ratio = Number(ratioBN);
          setTokenRatio(ratio);
      const tokenMaxDepositValue = getHighestBalance(tokenBalance)

          const depositValue = Object.entries(tokenBalance).reduce(
            (acc: { [key: string]: { depositValue: string; maxDepositValue: number } }, [t, balance]) => {
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
            }, {});
            setTokenDeposit(depositValue);
          }
        } 
      
    } 
  }, [tokenBalance, tokenBalance]);

  return {
    tokenRatio,
    tokenDeposit,
    setTokenDeposit,
    balanceIsNotSufficient,
  };
};
