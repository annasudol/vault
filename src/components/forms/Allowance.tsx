import React, { useState } from 'react';

import { useStore } from '@/store/store';
import type { TokensCollection } from '@/types';
import { StepType, TokenSymbol } from '@/types';

import { ButtonIcon, MyButton } from '../MyButton';
import { AllowanceForm } from './AllowanceForm';

const Allowance = () => {
  const { vault, depositValue, changeStep } = useStore();

  const [allowanceNeedsIncrease, setAllowanceNeedsIncrease] = useState<
    TokensCollection<boolean | null>
  >({
    WETH: null,
    rETH: null,
  });

  return (
    <div>
      <h2 className="mb-2 text-xl">Allowance</h2>
      {'data' in vault && (
        <>
          <AllowanceForm
            vault={vault?.data}
            depositValue={depositValue?.WETH?.int}
            token={TokenSymbol.WETH}
            updateAllowance={(value: boolean) =>
              setAllowanceNeedsIncrease({
                ...allowanceNeedsIncrease,
                [TokenSymbol.WETH]: value,
              })
            }
          />

          <AllowanceForm
            vault={vault.data}
            depositValue={depositValue?.rETH?.int}
            token={TokenSymbol.rETH}
            updateAllowance={(value: boolean) =>
              setAllowanceNeedsIncrease({
                ...allowanceNeedsIncrease,
                [TokenSymbol.rETH]: value,
              })
            }
          />
        </>
      )}
      {allowanceNeedsIncrease.WETH === false &&
        allowanceNeedsIncrease.rETH === false && (
          <MyButton
            onPress={() => changeStep(StepType.Liquidity)}
            icon={ButtonIcon.ArrowRight}
          >
            Proceed to Liquidity
          </MyButton>
        )}
    </div>
  );
};
export { Allowance };
