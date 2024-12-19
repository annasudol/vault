import { waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { Address } from '@/types';

export async function increaseTokenAllowance(
  contractAddress: Address,
  amount: bigint,
) {
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

    return tx;
  } catch (error) {
    return null;
  }
}
