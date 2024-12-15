import React from 'react';

import { UILayout } from '@/components/layout/UILayout';
import { TokenCard } from '@/components/TokenCard';
import { vaultData } from '@/lib/vaultData';

const Index = () => {
  return (
    <UILayout>
      {vaultData.map((vault) => (
        <TokenCard key={vault.vaultAddress} {...vault} />
      ))}
    </UILayout>
  );
};
export default Index;
