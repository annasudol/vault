import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import type { Address } from 'viem';

import { ErrorInfo } from '@/components/Error';
import { StepForm } from '@/components/forms/StepForm';
import { VaultHeader } from '@/components/header/VaultHeader';
import { ValultLayout } from '@/components/layout/ValultLayout';
import { Loading } from '@/components/Loading';
import { useReadVaultData } from '@/hooks/useReadVault';
import { useStore } from '@/store/store';

const Index = () => {
  const params = useParams<{ address: string }>();
  const vaultAddress = params?.address;
  const { vault, vaultSatus, vaultAddressIsInvalid, tokensCallStatus } =
    useReadVaultData(vaultAddress);

  const saveVaultData = useStore((state) => state.saveVaultData);

  useEffect(() => {
    if (!vaultAddressIsInvalid && vault && vaultAddress) {
      saveVaultData(vaultAddress as Address, vault);
    }
  }, [vault, vaultAddressIsInvalid, vaultAddress, saveVaultData]);

  if (vaultAddressIsInvalid) {
    return (
      <ValultLayout>
        <ErrorInfo
          message="Error"
          desription="The vault contract address is invalid"
        />
      </ValultLayout>
    );
  }

  if (
    vaultSatus.isLoading ||
    Object.values(tokensCallStatus).some((status) => status.isLoading)
  ) {
    return (
      <ValultLayout>
        <Loading
          title={
            vaultSatus.isLoading ? 'Reading Vault contract' : 'Read tokens data'
          }
        />
      </ValultLayout>
    );
  }

  if (
    vaultSatus.isError ||
    Object.values(tokensCallStatus).some((status) => status.isError)
  ) {
    return (
      <ValultLayout>
        <ErrorInfo
          message="Error"
          desription={
            vaultSatus.isError
              ? 'Errow while reading vault contract'
              : 'Errow while reading tokens data'
          }
        />
      </ValultLayout>
    );
  }

  if (vault) {
    return (
      <ValultLayout>
        <VaultHeader title={vault.contractName} tokens={vault.tokens} />
        <div className="mx-auto rounded-lg bg-white p-4 sm:max-w-lg">
          <StepForm />
        </div>
      </ValultLayout>
    );
  }
  return <> </>;
};

export default Index;
