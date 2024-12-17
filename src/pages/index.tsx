import React from 'react';

import { MainLayout } from '@/components/layout/MainLayout';
import { TokenCard } from '@/components/TokenCard';
import { vaultData } from '@/constants/vaultData';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex justify-center p-12">
        {vaultData.map((vault) => (
          <TokenCard key={vault.vaultAddress} {...vault} />
        ))}
      </div>
    </MainLayout>
  );
};
export default Index;
