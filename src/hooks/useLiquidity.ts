// 'use client';

// import { type Address, zeroAddress } from 'viem';
// import {
//   useAccount,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from 'wagmi';

// import { resolverABI } from '@/abi/resolverABI';
// import { routerABI } from '@/abi/routerABI';
// import { CONTRACT_ADDRESS } from '@/constants/contract';
// import { parseToBigInt } from '@/lib/formatBigInt';
// import { useStore } from '@/store/store';
// import type { CallContractStatus, TxHash } from '@/types';

// const useLiquidity = ({
//   vaultAddress,
// }: {
//   vaultAddress?: Address;
// }): {
//   tx?: TxHash;
//   handleAddLiquidity: () => void;
//   statusRead: CallContractStatus;
//   statusWrite: CallContractStatus;
//   argsError: boolean;
// } => {
//   const { address } = useAccount();
//   const { depositValue, vaults } = useStore();
//   const decimalsETH =
//     'data' in vault && vault.data.tokens.WETH
//       ? vault.data.tokens.WETH.decimals
//       : 18;
//   const decimalsrETH =
//     'data' in vault && vault.data.tokens.rETH
//       ? vault.data.tokens.rETH.decimals
//       : 18;

//   const {
//     data: minAmounts,
//     isLoading: readLoading,
//     isError: readError,
//   } = useReadContract({
//     address: CONTRACT_ADDRESS.RESOLVER,
//     abi: resolverABI,
//     functionName: 'getMintAmounts',
//     args: [
//       vaultAddress,
//       depositValue?.WETH?.bigInt,
//       depositValue?.rETH?.bigInt,
//     ],
//   });

//   const {
//     data: addLiquidityAllowanceHash,
//     writeContract: addLiquidity,
//     isPending: writeLoading,
//     isError: writeError,
//   } = useWriteContract();

//   const { isSuccess: txSuccess, isLoading: txLoading } =
//     useWaitForTransactionReceipt({
//       hash: addLiquidityAllowanceHash,
//       query: {
//         enabled: Boolean(addLiquidityAllowanceHash),
//       },
//     });

//   const amountShares = minAmounts && Array.isArray(minAmounts) && minAmounts[2];
//   const amount0Min = parseToBigInt(
//     (Number(depositValue?.WETH?.int) * 0.95).toString(),
//     decimalsETH,
//   );

//   const amount1Min = parseToBigInt(
//     (Number(depositValue?.rETH?.int) * 0.95).toString(),
//     decimalsrETH,
//   );

//   return {
//     tx: addLiquidityAllowanceHash,
//     handleAddLiquidity: () => {
//       addLiquidity({
//         address: CONTRACT_ADDRESS.ROUTER,
//         abi: routerABI,
//         functionName: 'addLiquidity',
//         args: [
//           {
//             amount0Max: depositValue?.WETH?.bigInt,
//             amount1Max: depositValue?.rETH?.bigInt,
//             amount0Min,
//             amount1Min,
//             amountSharesMin: amountShares,
//             vault: vaultAddress,
//             receiver: address,
//             gauge: zeroAddress,
//           },
//         ],
//       });
//     },
//     argsError: !address || !vaultAddress,
//     statusRead: {
//       isError: readError,
//       isLoading: readLoading,
//     },
//     statusWrite: {
//       isError: writeError,
//       isLoading: writeLoading || txLoading,
//       isSuccess: txSuccess,
//     },
//   };
// };

// export { useLiquidity };
