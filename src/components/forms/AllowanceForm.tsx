import { Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

import { MyAlert } from '@/components/MyAlert';
import { getAllAllowance } from '@/lib/contractHelpers/getAllowance';
import { increaseTokenAllowance } from '@/lib/contractHelpers/increaseAllowance';
import { parseToBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import type { TokenAllowanceBySymbol } from '@/types';
import { ResponseStatus, StepType } from '@/types';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { vault, tokenBalance, depositValue, changeStep } = useStore();
  const [allowance, setAllowance] = useState<TokenAllowanceBySymbol>();
  const fetchAllAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      return getAllAllowance(address, vault.data.tokens);
    }
    return null;
  }, [address, vault]);

  useEffect(() => {
    const fetchData = async () => {
      const allowanceResponse = await fetchAllAllowance();
      if (
        allowanceResponse &&
        allowanceResponse.status === ResponseStatus.Error
      ) {
        toast.error('Failed to fetch allowance');
        return;
      }
      if (allowanceResponse?.result) setAllowance(allowanceResponse?.result);
    };

    fetchData();
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

  const buttonNext = useMemo(() => {
    if (allowance && depositValue) {
      const allowanceNeedsIncreased = Object.keys(allowance).some(
        (token) =>
          allowance[token] &&
          depositValue[token] &&
          allowance[token].allowanceInt < depositValue[token],
      );
      return (
        !allowanceNeedsIncreased && (
          <Button
            color="primary"
            onPress={() => changeStep(StepType.Liquidity)}
            className="mt-4 w-48"
          >
            Next
          </Button>
        )
      );
    }
    return <></>;
  }, [allowance, depositValue]);

  if (!allowance) {
    return <div>Loading...</div>;
  }
  if (allowance && depositValue) {
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
        {buttonNext}
      </div>
    );
  }
  return <></>;
};

export { AllowanceForm };
