import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { zeroAddress } from 'viem';

import { routerABI } from '@/abi/routerABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { Address, DepositTokens, TxHash } from '@/types';

import { parseToBigInt } from '../formatBigInt';
import { getMintAmounts } from './getMinAmount';

export async function addLiquidity(
  deposits: DepositTokens,
  vault_address: Address,
  user: Address,
): Promise<TxHash> {
  const amountShares = await getMintAmounts(vault_address, deposits);
  const amount0Min = parseToBigInt(
    (Number(deposits.WETH?.int) * 0.95).toString(),
    18,
  );

  const amount1Min = parseToBigInt(
    (Number(deposits.WETH?.int) * 0.95).toString(),
    18,
  );
  try {
    const result = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS.ROUTER,
      abi: routerABI,
      functionName: 'addLiquidity',
      args: [
        {
          amount0Max: deposits.WETH?.bigInt,
          amount1Max: deposits.rETH?.bigInt,
          amount0Min,
          amount1Min,
          amountSharesMin: amountShares,
          vault: vault_address,
          receiver: user,
          gauge: zeroAddress,
        },
      ],
    });

    const tx = await waitForTransactionReceipt(wagmiConfig, {
      hash: result,
    });
    if (tx.status === 'reverted') {
      throw new Error('Transaction reverted');
    }
    if (tx.status === 'success') {
      return tx.transactionHash;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
  throw new Error('Transaction did not complete');
}
