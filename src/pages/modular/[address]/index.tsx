import React from 'react';

import { StepForm } from '@/components/forms/StepForm';
import { ValultLayout } from '@/components/layout/ValultLayout';
import VaultProvider from '@/providers/VaultProvider';

const Index = () => (
  <VaultProvider>
    <ValultLayout>
      <div className="mx-auto mt-12 min-h-60 rounded-lg bg-white p-4 sm:max-w-lg">
        <StepForm />
      </div>
    </ValultLayout>
  </VaultProvider>
);

export default Index;
