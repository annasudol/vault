import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useStore } from '@/store/store';

const AllowanceForm = () => {
  const { address } = useAccount();
  const { setCurrentAllowance } = useStore();
  useEffect(() => {
    if (!address) {
      return;
    }
    setCurrentAllowance(address);
  }, []);
  return (
    <div>
      <h1>Set WETH Allowance</h1>
    </div>
  );
};
export { AllowanceForm };
