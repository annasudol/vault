import React from 'react';

import { MainLayout } from '@/components/layout/MainLayout';
import { TokenCard } from '@/components/TokenCard';
import { vaultData } from '@/constants/vaultData';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-8 py-12 md:flex-row">
        {vaultData.map((vault) => (
          <TokenCard key={vault.vaultAddress} {...vault} />
        ))}
      </div>
    </MainLayout>
  );
};
export default HomePage;
