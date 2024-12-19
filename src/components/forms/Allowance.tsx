import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Loading } from '@/components/Loading';
import { MyAlert } from '@/components/MyAlert';
import { getAllAllowance } from '@/lib/contractHelpers/getAllowance';
import { truncateString } from '@/lib/truncateString';
import { useStore } from '@/store/store';
import type { AsyncResponse, TokenAllowance, TokensCollection } from '@/types';

import { AllowanceForm } from './AllowanceForm';

const Allowance = () => {
  const { address } = useAccount();
  const { vault, depositValue } = useStore();
  const [allowance, setAllowance] =
    useState<AsyncResponse<TokensCollection<TokenAllowance>>>();

  const fetchAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      const result = await getAllAllowance(address, vault.data.tokens);
      setAllowance(result);
    }
    return null;
  }, [address, vault]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance, address]);

  if (allowance?.status === 'pending') {
    return <Loading />;
  }

  if (
    allowance?.status === 'success' &&
    'data' in allowance &&
    depositValue &&
    vault &&
    'data' in vault
  ) {
    return (
      <AllowanceForm
        vault={vault.data}
        depositValue={depositValue}
        allowance={allowance.data}
      />
    );
  }
  return (
    <div className="flex h-40 items-center justify-center">
      <MyAlert
        message={
          truncateString(
            allowance?.status === 'error'
              ? (allowance.message ?? 'Error')
              : 'Error',
            100,
          ) || 'Error'
        }
        color="danger"
      />
      ;
    </div>
  );
};

export { Allowance };
