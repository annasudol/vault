import React, { useContext, useState } from 'react';
import { useAccount } from 'wagmi';

import { AllowanceForm } from '@/components/forms/AllowanceForm';
import { VaultContext } from '@/providers/VaultProvider';
import { StepType, type TokenInfo, type TokensCollection } from '@/types';

import { SubmitButton } from '../button/SubmitButton';

const Allowance = () => {
  const { address } = useAccount();
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
        address &&
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
          <SubmitButton onPress={handleChangeStep}>
            Proceed to Liquidity
          </SubmitButton>
        )}
    </div>
  );
};
export { Allowance };
