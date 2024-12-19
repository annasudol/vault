import { readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';

import { wagmiConfig } from '@/config/web3';
import { CONTRACT_ADDRESS } from '@/constants/contract';
import type { Address, AsyncResponse } from '@/types';
import { ResponseStatus } from '@/types';

import { formatBigInt } from '../formatBigInt';

export async function readAllowance(
  user: Address,
  token: Address,
  decimals: number,
): Promise<AsyncResponse<string>> {
  try {
    const balance = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: token,
      functionName: 'allowance',
      args: [user, CONTRACT_ADDRESS.ROUTER],
    });

    return {
      status: ResponseStatus.Success,
      data: formatBigInt(balance, decimals),
    };
  } catch (e) {
    return {
      status: ResponseStatus.Error,
      message: 'Error when read allowance',
    };
  }
}

// export async function getAllTokensAllowance(
//   address: Address,
//   tokens: TokensCollection<TokenInfo>,
// ): Promise<TokensCollection<AsyncResponse<string>>> {
//   const allowancePromises = Object.values(tokens).map(async (token) => {
//     const allowance = await readAllowance(
//       address,
//       token.address,
//       token.decimals,
//     );
//     return {
//       [token.symbol]: {
//         ...allowance,
//       },
//     };
//   });

//   const allowanceResponseArray = await Promise.all(allowancePromises);
//   return allowanceResponseArray.reduce(
//     (acc, curr) => ({ ...acc, ...curr }),
//     {},
//   );
// }
// export async function getTokensAllowance(
//   address: Address,
//   tokens: TokensCollection<TokenInfo>,
// ) {
//   const [wethAddress, sethAddress] = Object.values(tokens).map(
//     (token) => token.address,
//   );
//   if (!wethAddress || !sethAddress) {
//     return {
//       status: ResponseStatus.Error,
//       message: 'Error when read allowance',
//     };
//   }
//   const res = await Promise.all([
//     readAllowance(address, wethAddress),
//     readAllowance(address, sethAddress),
//   ]);
//   console.log(res, 'tokens');

//   return {
//     status: ResponseStatus.Error,
//     message: 'Error when read allowance',
//   };
// }
