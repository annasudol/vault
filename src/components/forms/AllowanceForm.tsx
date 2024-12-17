import { Button } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { getAllAllowance } from '@/lib/getAllowance';
import { useStore } from '@/store/store';
import type { TokenAllowanceBySymbol } from '@/types';
import { ResponseStatus } from '@/types';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { vault, depositValue } = useStore();
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

  if (!allowance) {
    return <div>Loading...</div>;
  }
  if (allowance && depositValue) {
    return (
      <div>
        {Object.entries(allowance || {}).map(([symbol, token]) => (
          <div key={symbol}>
            <h2>{symbol}</h2>
            <p>Allowance: {Number(token.allowanceInt).toFixed(4)}</p>
            <p>Deposit Value: {Number(depositValue[symbol]).toFixed(4)}</p>
            {Number(token.allowanceInt) > Number(depositValue[symbol]) && (
              <Button color="primary">set {symbol} allowance</Button>
            )}
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export { AllowanceForm };
