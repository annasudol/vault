import { writeContract } from '@wagmi/core';
import type { Address, Hash } from 'viem';
import { zeroAddress } from 'viem';

import { routerABI } from '@/abi/routerABI';
import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { DepositTokens } from '@/types';

export async function addLiquidity(
  deposits: DepositTokens,
  vault_address: Address,
  user?: Address,
): Promise<Hash> {
  if (!user) {
    throw new Error('Wallet address is not connected');
  }

  const tx = await writeContract(wagmiConfig, {
    abi: routerABI,
    address: CONTRACT_ADDRESS.ROUTER,
    functionName: 'addLiquidity',
    args: [
      {
        amount0Max: deposits.WETH,
        amount1Max: deposits.rETH,
        amount0Min: Number(deposits.WETH) * 0.95,
        amount1Min: Number(deposits.rETH) * 0.95,
        amountSharesMin: 0, // get min value from the contract
        vault: vault_address,
        receiver: user,
        gauge: zeroAddress,
      },
    ],
  });

  return tx;
}
