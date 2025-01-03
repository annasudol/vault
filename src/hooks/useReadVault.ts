import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { erc20Abi, isAddress } from 'viem';
import { useReadContract } from 'wagmi';

import { helperABI } from '@/abi/helperABI';
import { vaultABI } from '@/abi/valutABI';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type {
  CallContractStatus,
  TokenInfo,
  TokensCollection,
  TokenSymbol,
  VaultData,
} from '@/types';

interface ReadVaultDataReturn {
  vaultAddressIsInvalid: boolean;
  vaultData?: VaultData;
  vaultStatus: CallContractStatus;
  tokens: TokensCollection<TokenInfo>;
  tokensStatus: CallContractStatus;
}

export function useReadVaultData(vaultAddress: string): ReadVaultDataReturn {
  const [vaultAddressIsInvalid, setVaultAddressIsInvalid] =
    useState<boolean>(false);
  const setAddressIsInvalid = useCallback(() => {
    if (vaultAddress) {
      setVaultAddressIsInvalid(!isAddress(vaultAddress));
    }
  }, [vaultAddress]);

  useEffect(() => {
    setAddressIsInvalid();
  }, [setAddressIsInvalid]);

  const vaultContract = {
    abi: vaultABI,
    address: vaultAddress as Address,
  };

  const helperContract = {
    abi: helperABI,
    address: CONTRACT_ADDRESS.HELPER,
  };

  const {
    data: contractName,
    isLoading: readNameLoading,
    isError: readNameError,
  } = useReadContract({
    ...vaultContract,
    functionName: 'name',
  });

  const {
    data: token0Address,
    isLoading: readToken0AddressLoading,
    isError: readToken0AddressError,
  } = useReadContract({
    ...vaultContract,
    functionName: 'token0',
  });

  const {
    data: token1Address,
    isLoading: readToken1AddressLoading,
    isError: readToken1AddressError,
  } = useReadContract({
    ...vaultContract,
    functionName: 'token1',
  });

  const {
    data: totalUnderlying,
    isLoading: readTotalUnderlyingLoading,
    isError: readtoTalUnderlyingError,
  } = useReadContract({
    ...helperContract,
    functionName: 'totalUnderlying',
    args: [vaultAddress as Address],
  });

  const {
    data: token0Symbol,
    isLoading: readtoken0SymbolLoading,
    isError: readToken0SymbolError,
  } = useReadContract({
    abi: erc20Abi,
    address: token0Address,
    functionName: 'symbol',
  });

  const {
    data: token0Decimals,
    isLoading: readtoken0DecimalsLoading,
    isError: readToken0DecimalsError,
  } = useReadContract({
    abi: erc20Abi,
    address: token0Address,
    functionName: 'decimals',
  });

  const {
    data: token1Symbol,
    isLoading: readToken1SymbolLoading,
    isError: readToken1SymbolError,
  } = useReadContract({
    abi: erc20Abi,
    address: token1Address,
    functionName: 'symbol',
  });

  const {
    data: token1Decimals,
    isLoading: readToken1DecimalsLoading,
    isError: readToken1DecimalsError,
  } = useReadContract({
    abi: erc20Abi,
    address: token1Address,
    functionName: 'decimals',
  });
  let tokens = {};
  if (
    token0Symbol &&
    token1Symbol &&
    token0Address &&
    token1Address &&
    token0Decimals &&
    token1Decimals
  ) {
    tokens = {
      [token0Symbol as TokenSymbol]: {
        symbol: token0Symbol,
        decimals: token0Decimals,
        address: token0Address,
      },
      [token1Symbol as TokenSymbol]: {
        symbol: token1Symbol,
        decimals: token1Decimals,
        address: token1Address,
      },
    };
  }
  let vaultData: VaultData | undefined;

  if (totalUnderlying && contractName) {
    const ratioBN = totalUnderlying[1] / totalUnderlying[0];
    const ratio = Number(ratioBN);
    vaultData = {
      contractName,
      ratio,
    };
  }

  return {
    vaultAddressIsInvalid,
    vaultData,
    tokens,
    vaultStatus: {
      isError:
        readNameError ||
        readToken0AddressError ||
        readToken1AddressError ||
        readtoTalUnderlyingError,
      isLoading:
        readNameLoading ||
        readToken0AddressLoading ||
        readToken1AddressLoading ||
        readTotalUnderlyingLoading,
    },
    tokensStatus: {
      isError:
        readToken0SymbolError ||
        readToken0DecimalsError ||
        readToken1SymbolError ||
        readToken1DecimalsError,
      isLoading:
        readtoken0SymbolLoading ||
        readtoken0DecimalsLoading ||
        readToken1SymbolLoading ||
        readToken1DecimalsLoading,
    },
  };
}
