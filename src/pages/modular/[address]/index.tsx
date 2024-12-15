/* eslint-disable react-hooks/rules-of-hooks */
import { Spinner } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React from 'react';

import { Error } from '@/components/Error';
import { StepForm } from '@/components/forms/StepForm';
import { VaultHeader } from '@/components/header/VaultHeader';
import { ValultLayout } from '@/components/layout/ValultLayout';
import { useStore } from '@/store/vaultStore';
import { TokenSymbol } from '@/types';

const Index = () => {
  const params = useParams<{ address: string }>();
  const { vault, fetchVaultData, resetResponse } = useStore();

  React.useEffect(() => {
    fetchVaultData(params?.address);
    return () => {
      resetResponse();
    };
  }, [params?.address]);

  if (vault.status === 'pending') {
    return (
      <ValultLayout>
        <div className="flex min-h-60 w-full flex-col items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ValultLayout>
    );
  }
  if (vault.status === 'error') {
    return (
      <ValultLayout>
        <Error message="Error" desription={vault.message} />
      </ValultLayout>
    );
  }
  return (
    <ValultLayout>
      <VaultHeader
        title={vault.data.name}
        token1={TokenSymbol.WETH}
        token2={TokenSymbol.RETH}
      />
      <StepForm />
    </ValultLayout>
  );
};

export default Index;
