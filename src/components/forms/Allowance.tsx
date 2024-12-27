import React, { useContext, useState } from 'react';

import { AllowanceForm } from '@/components/forms/AllowanceForm';
import { ButtonIcon, MyButton } from '@/components/MyButton';
import { VaultContext } from '@/providers/VaultProvider';
import { StepType, type TokenInfo, type TokensCollection } from '@/types';

const Allowance = () => {
  const { tokens, vaultData, setStep, deposit } =
    useContext(VaultContext) ?? {};

  const [allowanceNeedsIncrease, setAllowanceNeedsIncrease] =
    useState<TokensCollection<boolean | null>>();

  const handleChangeStep = () => {
    if (setStep) {
      setStep(StepType.Liquidity);
    }
  };

  return (
    <div>
      <h2 className="my-8 text-xl">Allowance</h2>
      {vaultData &&
        deposit &&
        tokens &&
        Object.entries(deposit).map(([token, depositValue]) => {
          return (
            <AllowanceForm
              key={token}
              vault={vaultData}
              depositValue={depositValue}
              token={tokens[token] as TokenInfo}
              updateAllowance={(value: boolean) =>
                setAllowanceNeedsIncrease({
                  ...allowanceNeedsIncrease,
                  [token]: value,
                })
              }
            />
          );
        })}

      {allowanceNeedsIncrease &&
        Object.values(allowanceNeedsIncrease).every((v) => v === false) && (
          <MyButton onPress={handleChangeStep} icon={ButtonIcon.ArrowRight}>
            Proceed to Liquidity
          </MyButton>
        )}
    </div>
  );
};
export { Allowance };
