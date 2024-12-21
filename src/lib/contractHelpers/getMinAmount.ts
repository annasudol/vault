import { readContract } from '@wagmi/core';

import { resolverABI } from '@/abi/resolverABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { Address, DepositTokens } from '@/types';

export const getMintAmounts = async (
  vault: Address,
  deposits: DepositTokens,
): Promise<bigint> => {
  try {
    const result = await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS.RESOLVER,
      abi: resolverABI,
      functionName: 'getMintAmounts',
      args: [vault, deposits.WETH?.bigInt, deposits.rETH?.bigInt],
    });

    return (result as [bigint, bigint, bigint])[2];
  } catch (error) {
    throw new Error('Failed to get mint amounts');
  }
};
