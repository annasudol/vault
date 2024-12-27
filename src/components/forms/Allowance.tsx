import React, { useContext, useState } from 'react';

import { VaultContext } from '@/providers/VaultProvider';
import { StepType, type TokenInfo, type TokensCollection } from '@/types';

import { ButtonIcon, MyButton } from '../MyButton';
import { AllowanceForm } from './AllowanceForm';

const Allowance = () => {
  const { tokens, vaultData, setStep, deposit } =
    useContext(VaultContext) ?? {};

  const [allowanceNeedsIncrease, setAllowanceNeedsIncrease] =
    useState<TokensCollection<boolean | null>>();

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
              depositValue={depositValue?.int}
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
          <MyButton
            onPress={() => (setStep ? StepType.Liquidity : null)}
            icon={ButtonIcon.ArrowRight}
          >
            Proceed to Liquidity
          </MyButton>
        )}
    </div>
  );
};
export { Allowance };
