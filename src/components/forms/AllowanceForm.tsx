import { Alert, Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import { getAllAllowance } from '@/lib/getAllowance';
import { useStore } from '@/store/store';
import type { TokenAllowanceBySymbol } from '@/types';
import { ResponseStatus, StepType } from '@/types';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { vault, depositValue, changeStep } = useStore();
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
        return;
      }
      if (allowanceResponse?.result) setAllowance(allowanceResponse?.result);
    };

    fetchData();
  }, [fetchAllAllowance, address]);

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
            onClick={() => changeStep(StepType.Publish)}
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
              <Button color="primary">set {symbol} allowance</Button>
            ) : (
              <div key="success" className="my-3 flex w-96 items-center">
                <Alert
                  color="success"
                  title={`Allowance for ${symbol} is already set`}
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
