import type { Address } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { formatBigInt } from '@/lib/formatBigInt';
import type {
  CallContractStatus,
  TokenBalance,
  TokenInfo,
  TokensCollection,
  TokenSymbol,
} from '@/types';

interface GetTokenBalanceReturn {
  balance?: TokensCollection<TokenBalance>;
  balanceCallStatus: CallContractStatus;
}
const useGetTokenBalance = (
  tokens: TokensCollection<TokenInfo>,
): GetTokenBalanceReturn => {
  const tokensArr = Object.values(Object.values(tokens ?? {}));
  const { address } = useAccount();

  const token0 = tokensArr[0];
  const token1 = tokensArr[1];
  const {
    data: balanceToken0,
    isLoading: readbalanceToken0Loading,
    isError: readbalanceToken0Error,
  } = useReadContract({
    abi: erc20Abi,
    address: token0?.address,
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

  if (balanceToken1 !== undefined && balanceToken0 !== undefined) {
    const balance: TokensCollection<TokenBalance> = {
      [token0?.symbol as TokenSymbol]: {
        balanceInt: Number(
          formatBigInt(balanceToken0, token0?.decimals as number),
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
      balance,
      balanceCallStatus: {
        isError: readbalanceToken0Error || readbalanceToken1Error,
        isLoading: readbalanceToken0Loading || readbalanceToken1Loading,
      },
    };
  }

  return {
    balanceCallStatus: {
      isError: readbalanceToken0Error || readbalanceToken1Error,
      isLoading: readbalanceToken0Loading || readbalanceToken1Loading,
    },
  };
};

export { useGetTokenBalance };
