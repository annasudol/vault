'use client';

import { useEffect } from 'react';
import { erc20Abi } from 'viem';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { CONTRACT_ADDRESS } from '@/constants/contract';
import { formatBigInt, parseToBigInt } from '@/lib/formatBigInt';
import type { Address, CallContractStatus, TokenInfo, TxHash } from '@/types';

interface AddAllowance {
  amount: string;
}
interface IncreaseAllowance {
  token?: TokenInfo;
}

interface IncreaseAllowanceReturn {
  tx?: TxHash;
  allowance?: string;
  handleIncreaseAllowance: ({ amount }: AddAllowance) => void;
  statusRead: CallContractStatus;
  statusWrite: CallContractStatus;
  argsError: boolean;
}

const useIncreaseAllowance = ({
  token,
}: IncreaseAllowance): IncreaseAllowanceReturn => {
  const { address } = useAccount();
  const {
    data: allowanceBN,
    isLoading: readLoading,
    isError: readError,
    refetch: refetchAllowance,
  } = useReadContract({
    address: token?.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as Address, CONTRACT_ADDRESS.ROUTER],
  });

  const {
    data: increaseAllowanceHash,
    writeContract: increaseAllowance,
    isPending: writeLoading,
    isError: writeError,
  } = useWriteContract();

  const { isSuccess: txSuccess, isLoading: txLoading } =
    useWaitForTransactionReceipt({
      hash: increaseAllowanceHash,
      query: {
        enabled: Boolean(increaseAllowanceHash),
      },
    });

  useEffect(() => {
    if (txSuccess) {
      refetchAllowance();
    }
  }, [txSuccess]);
  const allowance = formatBigInt(allowanceBN || 0n, token?.decimals as number);

  return {
    tx: increaseAllowanceHash,
    allowance,
    handleIncreaseAllowance: ({ amount }: AddAllowance) => {
      increaseAllowance({
        address: token?.address as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          CONTRACT_ADDRESS.ROUTER,
          parseToBigInt(amount || '0', token?.decimals as number),
        ],
      });
    },
    argsError: !address || !token,
    statusRead: {
      isError: readError,
      isLoading: readLoading,
    },
    statusWrite: {
      isError: writeError,
      isLoading: writeLoading || txLoading,
      isSuccess: txSuccess,
    },
  };
};

export { useIncreaseAllowance };
