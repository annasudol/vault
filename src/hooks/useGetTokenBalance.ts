import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { erc20Abi, isAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { formatBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import type {
  CallContractStatus,
  TokenBalance,
  TokensCollection,
  TokenSymbol,
} from '@/types';

interface GetTokenBalanceReturn {
  vaultAddressIsInvalid: boolean;
  balance?: TokensCollection<TokenBalance>;
  tokensCallStatus: CallContractStatus;
}
const useGetTokenBalance = (vaultAddress: string): GetTokenBalanceReturn => {
  const [vaultAddressIsInvalid, setVaultAddressIsInvalid] = useState(false);

  useEffect(() => {
    if (vaultAddress) {
      setVaultAddressIsInvalid(!isAddress(vaultAddress));
    }
  }, [vaultAddress]);
  const { address } = useAccount();
  const { vaults } = useStore();
  const tokens = vaults[vaultAddress as keyof typeof vaults]?.tokens;
  const tokensArr = Object.values(Object.values(tokens ?? {}));

  const token0 = tokensArr[0];
  const token1 = tokensArr[1];
  const {
    data: balanceToken0,
    isLoading: readbalanceToken0Loading,
    isError: readbalanceToken0Error,
  } = useReadContract({
    abi: erc20Abi,
    address: token0?.address as Address,
    functionName: 'balanceOf',
    args: [address as Address],
  });

  const {
    data: balanceToken1,
    isLoading: readbalanceToken1Loading,
    isError: readbalanceToken1Error,
  } = useReadContract({
    abi: erc20Abi,
    address: token1?.address as Address,
    functionName: 'balanceOf',
    args: [address as Address],
  });

  if (balanceToken1 || balanceToken1) {
    const balance: TokensCollection<TokenBalance> = {
      [token0?.symbol as TokenSymbol]: {
        balanceInt: Number(
          formatBigInt(balanceToken0 as bigint, token0?.decimals as number),
        ).toString(),
        balanceBigInt: balanceToken0,
      },
      [token1?.symbol as TokenSymbol]: {
        balanceInt: Number(
          formatBigInt(balanceToken1 as bigint, token0?.decimals as number),
        ).toString(),
        balanceBigInt: balanceToken1,
      },
    };
    return {
      vaultAddressIsInvalid,
      balance,
      tokensCallStatus: {
        isError: readbalanceToken0Error || readbalanceToken1Error,
        isLoading: readbalanceToken0Loading || readbalanceToken1Loading,
      },
    };
  }

  return {
    vaultAddressIsInvalid,
    tokensCallStatus: {
      isError: readbalanceToken0Error || readbalanceToken1Error,
      isLoading: readbalanceToken0Loading || readbalanceToken1Loading,
    },
  };
};

export { useGetTokenBalance };
