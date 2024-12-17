import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { getAllAllowance } from '@/lib/getAllowance';
import { useStore } from '@/store/store';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { vault } = useStore();
  const [setAllowance] = useState<any>();
  const fetchAllAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      return getAllAllowance(address, vault.data.tokens);
    }
    return null;
  }, [address, vault]);

  useEffect(() => {
    const fetchData = async () => {
      const allowance = await fetchAllAllowance();
      setAllowance(allowance);
    };

    fetchData();
  }, [fetchAllAllowance, address]);

  return (
    <div>
      <h1>Set WETH Allowance</h1>
    </div>
  );
};

export { AllowanceForm };
