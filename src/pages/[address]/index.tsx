import { isAddress } from 'ethers';
import { useParams } from 'next/navigation';
import React from 'react';

import { UILayout } from '@/components/layout/UILayout';

const Index = () => {
  // const { address } = use(params);
  const params = useParams<{ address: string }>();
  console.log(isAddress(params?.address));

  return <UILayout>zzz</UILayout>;
};

export default Index;
