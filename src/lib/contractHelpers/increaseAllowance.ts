import { waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { type Address, type AsyncResponse, ResponseStatus } from '@/types';

type TxHash = `0x${string}`;
export async function increaseTokenAllowance(
  contractAddress: Address,
  amount: bigint,
): Promise<AsyncResponse<TxHash>> {
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
      return {
        status: ResponseStatus.Error,
        message: 'Transaction reverted',
      };
    }
    if (tx.status === 'success') {
      return {
        status: ResponseStatus.Success,
        data: tx.transactionHash,
      };
    }
  } catch (error) {
    return {
      status: ResponseStatus.Error,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  return {
    status: ResponseStatus.Error,
    message: 'Transaction did not complete',
  };
}
