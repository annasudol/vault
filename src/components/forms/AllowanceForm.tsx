import { Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Loading } from '@/components/Loading';
import { MyAlert } from '@/components/MyAlert';
import { getAllAllowance } from '@/lib/contractHelpers/getAllowance';
import { increaseTokenAllowance } from '@/lib/contractHelpers/increaseAllowance';
import { parseToBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import type { AsyncResponse, TokenAllowanceBySymbol } from '@/types';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { vault, tokenBalance, depositValue } = useStore();
  const [allowance, setAllowance] =
    useState<AsyncResponse<TokenAllowanceBySymbol>>();
  const fetchAllAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      const result = await getAllAllowance(address, vault.data.tokens);
      setAllowance(result);
      return result;
    }
    return null;
  }, [address, vault]);

  useEffect(() => {
    fetchAllAllowance();
  }, [fetchAllAllowance, address]);

  const handleSetAllowance = async (symbol: string) => {
    if (
      vault.status === 'success' &&
      'data' in vault &&
      tokenBalance &&
      tokenBalance.status === 'success' &&
      'data' in tokenBalance &&
      address
    ) {
      const contractAddress = vault.data.tokens[symbol]?.address;
      const amountToAllow = depositValue?.[symbol];
      const decimals = vault.data.tokens[symbol]?.decimals;
      if (contractAddress && amountToAllow && decimals) {
        const amountToAllowBN = parseToBigInt(
          amountToAllow.toString(),
          Number(decimals),
        );
        try {
          if (contractAddress) {
            await increaseTokenAllowance(contractAddress, amountToAllowBN);
          } else {
            console.error('Contract address is undefined');
          }
        } catch (e) {
          console.log(e, 'errpor');
        }
      }
    } else {
      console.log('error');
    }
  };
  console.log(allowance, 'allowance');

  // const buttonNext = useMemo(() => {
  //   if (allowance && depositValue) {
  //     const allowanceNeedsIncreased = Object.keys(allowance).some(
  //       (token) =>
  //         allowance[token] &&
  //         depositValue[token] &&
  //         allowance[token].allowanceInt < depositValue[token],
  //     );
  //     return (
  //       !allowanceNeedsIncreased && (
  //         <Button
  //           color="primary"
  //           onPress={() => changeStep(StepType.Liquidity)}
  //           className="mt-4 w-48"
  //         >
  //           Next
  //         </Button>
  //       )
  //     );
  //   }
  //   return <></>;
  // }, [allowance, depositValue]);

  if (allowance?.status === 'pending') {
    return <Loading />;
  }
  if (allowance?.status === 'success' && depositValue) {
    return (
      <div className="px-6 py-4">
        {Object.entries(allowance || {}).map(([symbol, token]) => (
          <div key={symbol}>
            <h2 className="text-lg font-medium">{symbol}</h2>
            <p>Allowance: {Number(token.allowanceInt).toFixed(4)}</p>
            <p>Deposit Value: {Number(depositValue[symbol]).toFixed(4)}</p>
            {Number(token.allowanceInt) < Number(depositValue[symbol]) ? (
              <Button
                color="primary"
                onPress={() => handleSetAllowance(symbol)}
              >
                set {symbol} allowance
              </Button>
            ) : (
              <div key="success" className="my-3 flex w-96 items-center">
                <MyAlert
                  color="success"
                  message={`Allowance for ${symbol} is already set`}
                />
              </div>
            )}
          </div>
        ))}
        {/* {buttonNext} */}
      </div>
    );
  }
  return <></>;
};

export { AllowanceForm };
