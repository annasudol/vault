import { waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { type Address } from '@/types';

type TxHash = `0x${string}`;

export async function increaseTokenAllowance(
  contractAddress: Address,
  amount: bigint,
): Promise<TxHash> {
  try {
    const result = await writeContract(wagmiConfig, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS.ROUTER, amount],
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
