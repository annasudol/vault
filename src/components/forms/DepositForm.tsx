import { Form } from '@nextui-org/react';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { Loading } from '@/components/Loading';
import { MyAlert } from '@/components/MyAlert';
import { MyButton } from '@/components/MyButton';
import { INPUT_VALUE_PRECISION } from '@/constants/contract';
import { useTokenRatio } from '@/hooks/useTokenRatio';
import { parseToBigInt } from '@/lib/formatBigInt';
import { truncateString } from '@/lib/truncateString';
import { useStore } from '@/store/store';
import type { DepositTokens } from '@/types';
import { StepType, TokenSymbol } from '@/types';

const DepositForm = () => {
  const { vault, tokenBalance, setDepositValue, changeStep } = useStore();
  const { address } = useAccount();
  const [isError, setIsError] = useState(false);

  const {
    tokenRatio,
    tokensAllBalance,
    tokenDeposit,
    setTokenDeposit,
    balanceIsNotSufficient,
  } = useTokenRatio(address);

  const handleUpdateTokenDepositValue = (token: string, value: string) => {
    if (!tokenDeposit || !tokenDeposit[token] || !tokenRatio) {
      return;
    }
    // update token0 and token1 based on token0 value
    if (token === TokenSymbol.WETH) {
      const balance0 = Number(value);
      const balance1 = balance0 * tokenRatio;
      setTokenDeposit({
        ...tokenDeposit,
        [TokenSymbol.rETH]: {
          ...tokenDeposit[TokenSymbol.rETH],
          depositValue: balance1.toFixed(INPUT_VALUE_PRECISION),
        },
        [token]: {
          ...tokenDeposit[token],
          depositValue: value,
        },
      });
    } else {
      // update token1 and token0 based on token1 value
      const balance1 = Number(value);
      const balance0 = balance1 / tokenRatio;
      setTokenDeposit({
        ...tokenDeposit,
        [TokenSymbol.WETH]: {
          ...tokenDeposit[TokenSymbol.WETH],
          depositValue: balance0.toFixed(INPUT_VALUE_PRECISION),
        },
        [token]: {
          ...tokenDeposit[token],
          depositValue: value,
        },
      });
    }
  };

  const getButtonText = () => {
    if (!address) {
      return 'Wallet is disconnected';
    }
    if (balanceIsNotSufficient) {
      return 'Balance is not suficient';
    }
    return 'Submit';
  };

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    if (isError) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    if ('data' in vault) {
      const datas: DepositTokens = {
        [TokenSymbol.WETH]: {
          int: formData.get(TokenSymbol.WETH) as string,
          bigInt: parseToBigInt(
            formData.get(TokenSymbol.WETH) as string,
            vault.data.tokens[TokenSymbol.WETH]?.decimals || 18,
          ),
        },
        [TokenSymbol.rETH]: {
          int: formData.get(TokenSymbol.rETH) as string,
          bigInt: parseToBigInt(
            formData.get(TokenSymbol.rETH) as string,
            vault.data.tokens[TokenSymbol.rETH]?.decimals || 18,
          ),
        },
      };
      setDepositValue(datas);
      changeStep(StepType.Allowance);
    }
  };

  if (vault.status === 'success' && 'data' in vault) {
    const { tokens } = vault.data;
    const tokensSymbols = Object.keys(tokens);
    return (
      <Form
        className="mb-11 min-h-96 w-full max-w-sm"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        {Object.keys(tokens).map((token) => {
          const balance = tokensAllBalance?.[token]?.balanceInt;
          const maxValue = tokenDeposit?.[token]?.maxDepositValue || 0;
          const value = tokenDeposit?.[token]?.depositValue || '0';
          return (
            <TokenInput
              key={token}
              name={token}
              value={value}
              setValue={(val: string) =>
                handleUpdateTokenDepositValue(token, val as string)
              }
              balance={balance}
              max={maxValue}
              label={`${token} Amount`}
              displaySlider={token === TokenSymbol.rETH}
              setError={setIsError}
            />
          );
        })}
        {balanceIsNotSufficient && (
          <MyAlert
            message={`You dont have enough balace of ${tokensSymbols[0]} 
            and /or ${tokensSymbols[1]}`}
            color="danger"
          />
        )}
        {tokenBalance.status === 'error' && (
          <div className="flex h-40 items-center justify-center">
            <MyAlert
              message={truncateString(tokenBalance.message, 100) || 'Error'}
              color="danger"
            />
            ;
          </div>
        )}
        <MyButton
          type="submit"
          className="w-full"
          isDisabled={balanceIsNotSufficient || !address}
        >
          {getButtonText()}
        </MyButton>
      </Form>
    );
  }
  if (vault.status === 'pending' || tokenBalance.status === 'pending') {
    return <Loading title="loading form" />;
  }
  if (vault.status === 'error' || tokenBalance.status === 'error') {
    const errorMessage = vault.message || 'Failed to fetch data';
    return (
      <div className="flex h-40 items-center justify-center">
        <MyAlert message={errorMessage} color="danger" />;
      </div>
    );
  }
  return <></>;
};

export { DepositForm };
