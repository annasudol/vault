import { waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { erc20Abi } from '@/abi/erc20ABI';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import { WALLET_CONNECT_CONFIG } from '@/lib/web3';
import type { Address } from '@/types';

export async function approveToken(contractAddress: Address, amount: bigint) {
  try {
    const result = await writeContract(WALLET_CONNECT_CONFIG, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS.ROUTER, amount],
    });

    const tx = await waitForTransactionReceipt(WALLET_CONNECT_CONFIG, {
      hash: result,
    });

    return tx;
  } catch (error) {
    console.log(error, 'error');
    return null;
  }
}
