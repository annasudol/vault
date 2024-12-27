import React from 'react';

import { StepForm } from '@/components/forms/StepForm';
import { ValultLayout } from '@/components/layout/ValultLayout';
import VaultProvider from '@/providers/VaultProvider';

const Index = () => (
  <VaultProvider>
    <ValultLayout>
      <div className="mx-auto mt-12 rounded-lg bg-white p-4 sm:max-w-lg">
        <StepForm />
      </div>
    </ValultLayout>
  </VaultProvider>
);

export default Index;
