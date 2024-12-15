/* eslint-disable react-hooks/rules-of-hooks */
import { Spinner } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React from 'react';

import { Error } from '@/components/Error';
import { ValultLayout } from '@/components/layout/ValultLayout';
import { useReadValut } from '@/hooks/useReadValut';

const Index = () => {
  const params = useParams<{ address: string }>();
  const address = params?.address;
  const response = useReadValut(address);

  if (response.status === 'pending') {
    return (
      <ValultLayout>
        <div className="flex min-h-60 w-full flex-col items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ValultLayout>
    );
  }
  if (response.status === 'error') {
    return (
      <ValultLayout>
        <Error message="Error" desription={response.message} />
      </ValultLayout>
    );
  }
  return <ValultLayout>success</ValultLayout>;
};

export default Index;
