import React, { useContext, useRef } from 'react';

import Steps from '@/components/Steps';
import { VaultContext } from '@/providers/VaultProvider';
import { StepType } from '@/types';

import { Allowance } from './Allowance';
import { DepositForm } from './DepositForm';
import { LiquidityForm } from './LiquidityForm';

const StepForm = () => {
  const { step } = useContext(VaultContext) ?? {};
  const getCurrentStepNumber = (currentStep?: StepType) => {
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
  const ref = useRef<HTMLButtonElement | null>(null);
  return (
    <div className="flex flex-col items-center justify-center">
      <Steps
        ref={ref || undefined}
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
