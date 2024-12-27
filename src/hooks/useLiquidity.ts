'use client';

import { useContext } from 'react';
import { type Address, zeroAddress } from 'viem';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { resolverABI } from '@/abi/resolverABI';
import { routerABI } from '@/abi/routerABI';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { parseToBigInt } from '@/lib/formatBigInt';
import { VaultContext } from '@/providers/VaultProvider';
import type { CallContractStatus, TxHash } from '@/types';

const useLiquidity = ({
  vaultAddress,
}: {
  vaultAddress?: Address;
}): {
  tx?: TxHash;
  handleAddLiquidity: () => void;
  statusRead: CallContractStatus;
  statusWrite: CallContractStatus;
  argsError: boolean;
} => {
  const { address } = useAccount();
  const { tokens, deposit } = useContext(VaultContext) ?? {};
  const depositT0 = Object.values(deposit ?? {})[0];
  const depositT1 = Object.values(deposit ?? {})[1];

  const tokensArray = Object.values(tokens ?? {});
  const decimalsT0 = tokensArray[0]?.decimals;
  const decimalsT1 = tokensArray[1]?.decimals;

  const {
    data: minAmounts,
    isLoading: readLoading,
    isError: readError,
  } = useReadContract({
    address: CONTRACT_ADDRESS.RESOLVER,
    abi: resolverABI,
    functionName: 'getMintAmounts',
    args: [vaultAddress, depositT0?.bigInt, depositT1?.bigInt],
  });

  const {
    data: addLiquidityAllowanceHash,
    writeContract: addLiquidity,
    isPending: writeLoading,
    isError: writeError,
  } = useWriteContract();

  const { isSuccess: txSuccess, isLoading: txLoading } =
    useWaitForTransactionReceipt({
      hash: addLiquidityAllowanceHash,
      query: {
        enabled: Boolean(addLiquidityAllowanceHash),
      },
    });

  const amountShares = minAmounts && Array.isArray(minAmounts) && minAmounts[2];
  const amount0Min = parseToBigInt(
    (Number(depositT0?.int || 0) * 0.95).toString(),
    decimalsT0 as number,
  );

  const amount1Min = parseToBigInt(
    (Number(depositT1?.int || 0) * 0.95).toString(),
    decimalsT1 as number,
  );

  return {
    tx: addLiquidityAllowanceHash,
    handleAddLiquidity: () => {
      addLiquidity({
        address: CONTRACT_ADDRESS.ROUTER,
        abi: routerABI,
        functionName: 'addLiquidity',
        args: [
          {
            amount0Max: depositT0?.bigInt,
            amount1Max: depositT1?.bigInt,
            amount0Min,
            amount1Min,
            amountSharesMin: amountShares,
            vault: vaultAddress,
            receiver: address,
            gauge: zeroAddress,
          },
        ],
      });
    },
    argsError: !address || !vaultAddress,
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

export { useLiquidity };
