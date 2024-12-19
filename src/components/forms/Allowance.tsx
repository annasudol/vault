import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { readAllowance } from '@/lib/contractHelpers/getAllowance';
import { useStore } from '@/store/store';
import type { TokenAllowanceResponse, TokensCollection } from '@/types';
import { StepType, TokenSymbol } from '@/types';

import { Loading } from '../Loading';
import { MyAlert } from '../MyAlert';
import { ButtonIcon, MyButton } from '../MyButton';
import { AllowanceForm } from './AllowanceForm';

const Allowance = () => {
  const { address } = useAccount();
  const { vault, depositValue, changeStep } = useStore();

  const [tokenWETHAllowance, setTokenWETHAllowance] =
    useState<TokenAllowanceResponse>();

  const [tokenrETHAllowance, setTokenrETHAllowance] =
    useState<TokenAllowanceResponse>();

  const [allowanceNeedsIncrease, setAllowanceNeedsIncrease] = useState<
    TokensCollection<boolean | null>
  >({
    WETH: null,
    rETH: null,
  });

  const fetchWETHAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      const wethToken = vault.data.tokens.WETH;
      if (wethToken?.address && wethToken?.decimals !== undefined) {
        const result = await readAllowance(
          address,
          wethToken.address,
          wethToken.decimals,
        );
        setTokenWETHAllowance(result);
      }
    }
    return null;
  }, [address, vault]);

  const fetchrETHAllowance = useCallback(async () => {
    if (address && vault.status === 'success' && 'data' in vault) {
      const rethToken = vault.data.tokens.rETH;
      if (rethToken?.address && rethToken?.decimals !== undefined) {
        const result = await readAllowance(
          address,
          rethToken.address,
          rethToken.decimals,
        );
        setTokenrETHAllowance(result);
      }
    }
    return null;
  }, [address, vault]);

  useEffect(() => {
    fetchWETHAllowance();
    fetchrETHAllowance();
  }, [address, vault]);

  useEffect(() => {
    if (
      depositValue &&
      vault &&
      'data' in vault &&
      tokenWETHAllowance &&
      'data' in tokenWETHAllowance &&
      tokenrETHAllowance &&
      'data' in tokenrETHAllowance
    ) {
      const status = {
        WETH: Number(tokenWETHAllowance.data) < Number(depositValue.WETH),
        rETH: Number(tokenrETHAllowance.data) < Number(depositValue.rETH),
      };
      setAllowanceNeedsIncrease(status);
    }
  }, [depositValue, tokenWETHAllowance, tokenrETHAllowance, vault]);

  if (vault.status === 'pending') {
    return <Loading />;
  }

  if (vault.status === 'error') {
    const errorMessage = vault.message || 'Failed to fetch data';
    return (
      <div className="flex h-40 items-center justify-center">
        <MyAlert message={errorMessage} color="danger" />;
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-xl">Allowance</h2>
      {tokenWETHAllowance && (
        <AllowanceForm
          vault={vault.data}
          depositValue={depositValue?.WETH}
          allowance={tokenWETHAllowance}
          token={TokenSymbol.WETH}
          allowanceNeedsIncrease={allowanceNeedsIncrease.WETH}
          handleUpdateAllowance={fetchWETHAllowance}
        />
      )}
      {tokenrETHAllowance && (
        <AllowanceForm
          vault={vault.data}
          depositValue={depositValue?.rETH}
          allowance={tokenrETHAllowance}
          token={TokenSymbol.rETH}
          allowanceNeedsIncrease={allowanceNeedsIncrease.rETH}
          handleUpdateAllowance={fetchrETHAllowance}
        />
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
