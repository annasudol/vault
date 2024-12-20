/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { isAddress } from 'viem';

import { Error } from '@/components/Error';
import { StepForm } from '@/components/forms/StepForm';
import { VaultHeader } from '@/components/header/VaultHeader';
import { ValultLayout } from '@/components/layout/ValultLayout';
import { Loading } from '@/components/Loading';
import { useStore } from '@/store/store';

const Index = () => {
  const params = useParams<{ address: string }>();
  const { vault, fetchVaultData } = useStore();
  const [vaultAddressIsInvalid, setVaultAddressIsInvalid] = useState(false);

  useEffect(() => {
    const vaultAddress = params?.address;
    if (vaultAddress) {
      if (!isAddress(vaultAddress)) {
        setVaultAddressIsInvalid(true);
      } else {
        fetchVaultData(vaultAddress);
      }
    }
  }, [params?.address]);

  if (vault.status === 'pending') {
    return (
      <ValultLayout>
        <Loading />
      </ValultLayout>
    );
  }
  if (vaultAddressIsInvalid) {
    return (
      <ValultLayout>
        <Error
          message="Error"
          desription="The vault contract address is invalid"
        />
      </ValultLayout>
    );
  }
  if (vault.status === 'success' && vault.data) {
    return (
      <ValultLayout>
        <VaultHeader
          title={vault.data.contractName}
          tokens={vault.data.tokens}
        />
        <div className="mx-auto rounded-lg bg-white p-4 sm:max-w-xl">
          <StepForm />
        </div>
      </ValultLayout>
    );
  }
  return (
    <ValultLayout>
      <Error
        message="Error"
        desription={
          'message' in vault
            ? vault.message
            : 'Unknown error occured while fetching vault data'
        }
      />
    </ValultLayout>
  );
};

export default Index;
