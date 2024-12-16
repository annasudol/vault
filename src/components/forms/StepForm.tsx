import React from 'react';

import Steps from '@/components/Steps';
import { useStore } from '@/store/store';

import { DepositForm } from './DepositForm';

const StepForm = () => {
  const { vault } = useStore();
  // eslint-disable-next-line no-console
  console.log(vault);
  const [currentStep] = React.useState(0);

  return (
    <div>
      <Steps
        defaultStep={currentStep}
        steps={[
          {
            title: 'Deposit',
          },
          {
            title: 'Set allowance',
          },
          {
            title: 'Publish',
          },
        ]}
      />
      {currentStep === 0 && <DepositForm />}
    </div>
  );
};

export { StepForm };
