import React from 'react';

import Steps from '@/components/Steps';

import { DepositForm } from './DepositForm';

const StepForm = () => {
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
