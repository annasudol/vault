import { NextSeo } from 'next-seo';
import type { PropsWithChildren } from 'react';
import React, { useContext } from 'react';

import { ErrorInfo } from '@/components/Error';
import { Footer } from '@/components/Footer';
import { VaultHeader } from '@/components/header/VaultHeader';
import { Loading } from '@/components/Loading';
import { MainNavbar } from '@/components/MainNavbar';
import { AppConfig } from '@/config/AppConfig';
import { VaultContext } from '@/providers/VaultProvider';

export function ValultLayout(props: PropsWithChildren) {
  const {
    vaultAddressIsInvalid,
    vaultData,
    tokens,
    vaultStatus,
    tokensStatus,
  } = useContext(VaultContext) ?? {};

  return (
    <div className="flex min-h-screen flex-col">
      <NextSeo
        title={`${AppConfig.site_name} | ${vaultData?.contractName ? vaultData?.contractName : 'Vault'}`}
        description={AppConfig.description}
        canonical={AppConfig.url}
      />
      <MainNavbar />
      {vaultAddressIsInvalid && (
        <ErrorInfo
          message="Error"
          desription="The vault contract address is invalid"
        />
      )}
      {vaultData && tokens && (
        <VaultHeader title={vaultData?.contractName} tokens={tokens} />
      )}
      <main className="min-h-[90vh] bg-slate-100">
        <div className="mx-auto mb-12 max-w-screen-lg px-4">
          {vaultStatus?.isLoading && <Loading title="Reading Vault contract" />}
          {tokensStatus?.isLoading && (
            <Loading title="Reading tokens contract" />
          )}
          {vaultStatus?.isError && (
            <ErrorInfo
              message="Error"
              desription="Error while reading vault contract"
            />
          )}
          {tokensStatus?.isError && (
            <ErrorInfo
              message="Error"
              desription="Error while reading token contract"
            />
          )}
          {vaultData?.contractName && tokens && props.children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
