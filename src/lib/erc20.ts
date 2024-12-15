import { readContract } from '@wagmi/core';
import type { Address } from 'viem';

import { erc20Abi } from '@/abi/erc20ABI';
import { wagmiConfig } from '@/lib/web3';
import type { Response } from '@/types';
import { ResponseStatus } from '@/types';

// export async function approveToken(spender: Address, amount: BigInt) {
//   const hash = await writeContract(wagmiConfig, {
//     abi: erc20Abi,
//     address: amount.token.address,
//     functionName: 'approve',
//     args: [spender, amount],
//   });

//   const reciept = await waitForTransactionReceipt(wagmiConfig, { hash });

//   return reciept;
// }

export async function getTokenBalance(
  wallet_address: Address,
  token_address: Address,
): Promise<Response<BigInt>> {
  const erc20Config = { abi: erc20Abi } as const;

  try {
    const balance = await readContract(wagmiConfig, {
      ...erc20Config,
      address: token_address,
      functionName: 'balanceOf',
      args: [wallet_address],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch {
    return { status: ResponseStatus.Error };
  }
}

export async function getCurrentAllowance(
  user: Address,
  spender: Address,
  token_address: Address,
): Promise<Response<BigInt>> {
  const erc20Config = { abi: erc20Abi } as const;
  try {
    const balance = await readContract(wagmiConfig, {
      ...erc20Config,
      address: token_address,
      functionName: 'allowance',
      args: [user, spender],
    });

    return {
      status: ResponseStatus.Success,
      data: balance,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return { status: ResponseStatus.Error };
  }
}
