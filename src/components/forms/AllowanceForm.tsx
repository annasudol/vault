import React, { useState } from 'react';

import { MyAlert } from '@/components/MyAlert';
import { ButtonIcon, MyButton } from '@/components/MyButton';
import { increaseTokenAllowance } from '@/lib/contractHelpers/increaseAllowance';
import { parseToBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import {
  type DepositTokens,
  StepType,
  type TokenAllowance,
  type TokensCollection,
  type VaultData,
} from '@/types';

interface AllowanceProps {
  allowance: TokensCollection<TokenAllowance>;
  depositValue: DepositTokens;
  vault: VaultData;
}

const AllowanceForm: React.FC<AllowanceProps> = ({
  allowance,
  depositValue,
  vault,
}) => {
  const { changeStep } = useStore();

  const handleSetAllowance = async (symbol: string) => {
    const contractAddress = vault.tokens[symbol]?.address;
    const amountToAllow = depositValue?.[symbol];
    const decimals = vault.tokens[symbol]?.decimals;
    if (contractAddress && amountToAllow && decimals) {
      const amountToAllowBN = parseToBigInt(
        amountToAllow.toString(),
        Number(decimals),
      );
      try {
        if (contractAddress) {
          await increaseTokenAllowance(contractAddress, amountToAllowBN);
        }
      } catch (e) {
        console.log(e, 'errpor');
      }
    }
  };

  const [allowanceHasToIncrease, setAllowanceHasToIncrease] = useState(false);
  return (
    <div className="px-6 py-4">
      {Object.entries(allowance).map(([symbol, token]) => {
        const tokenTyped = token as TokenAllowance;
        const shouldIncreaseAllowance =
          Number(tokenTyped.allowanceInt) < Number(depositValue[symbol]);

        if (shouldIncreaseAllowance) {
          setAllowanceHasToIncrease(true);
        }

        return (
          <div key={symbol}>
            <h2 className="text-lg font-medium">{symbol}</h2>
            <p>Allowance: {Number(tokenTyped.allowanceInt).toFixed(4)}</p>
            <p>Deposit Value: {Number(depositValue[symbol]).toFixed(4)}</p>
            {shouldIncreaseAllowance ? (
              <MyButton onPress={() => handleSetAllowance(symbol)}>
                Set {symbol} Allowance
              </MyButton>
            ) : (
              <MyAlert
                color="success"
                message={`Allowance for ${symbol} is already set`}
              />
            )}
          </div>
        );
      })}
      {!allowanceHasToIncrease && (
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

export { AllowanceForm };
