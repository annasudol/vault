import React from 'react';

import { Allowance } from '@/components/forms/Allowance';
import { DepositForm } from '@/components/forms/DepositForm';
import { LiquidityForm } from '@/components/forms/LiquidityForm';
import Steps from '@/components/Steps';
import { useStore } from '@/store/store';
import { StepType } from '@/types';

const StepForm = () => {
  const { step } = useStore();

  const getCurrentStepNumber = (currentStep: StepType) => {
    switch (currentStep) {
      case StepType.Deposit:
        return 1;
      case StepType.Allowance:
        return 2;
      case StepType.Liquidity:
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Steps
        currentStep={getCurrentStepNumber(step)}
        steps={[
          {
            title: 'Deposit',
            type: StepType.Deposit,
          },
          {
            title: 'Allowance',
            type: StepType.Allowance,
          },
          {
            title: 'Liquidity',
            type: StepType.Liquidity,
          },
        ]}
      />
      {step === StepType.Deposit && <DepositForm />}
      {step === StepType.Allowance && <Allowance />}
      {step === StepType.Liquidity && <LiquidityForm />}
    </div>
  );
};

export { StepForm };
