import { Button, Form } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { Loading } from '@/components/Loading';
import { MyAlert } from '@/components/MyAlert';
import { INPUT_VALUE_PRECISION } from '@/constants/contract';
import { useStore } from '@/store/store';
import type { TokensAllBalance } from '@/types';
import { StepType, TokenSymbol } from '@/types';

export interface TokenDeposit {
  depositValue?: string;
  maxDepositValue?: number;
}

export interface TokenDepositBySymbol {
  [key: string]: TokenDeposit;
}

const DepositForm = () => {
  const {
    vault,
    fetchTokenBalance,
    tokenBalance,
    setDepositValue,
    changeStep,
  } = useStore();
  const { address } = useAccount();

  const [tokenRatio, setTokenRatio] = useState<number>();
  const [tokensAllBalance, setTokensAllBalance] = useState<TokensAllBalance>();
  const [tokenDeposit, setTokenDeposit] = useState<TokenDepositBySymbol>();

  const [isError, setIsError] = useState(false);

  const [balanceIsNotSuficient, setBalanceIsNotSuficient] =
    useState<boolean>(false);

  const handleFetchTokenBalance = useCallback(() => {
    if (!address) {
      return;
    }
    fetchTokenBalance(address);
  }, [address, fetchTokenBalance]);

  useEffect(() => {
    handleFetchTokenBalance();
  }, [address]);

  useEffect(() => {
    if (
      vault.status === 'success' &&
      'data' in vault &&
      tokenBalance.status === 'success' &&
      'data' in tokenBalance
    ) {
      const tokenBalanceData = tokenBalance.data;
      setTokensAllBalance(tokenBalanceData);

      const balances = Object.values(tokenBalanceData);
      if (balances.some((balance) => balance.balanceInt === '0')) {
        setBalanceIsNotSuficient(true);
      } else {
        const { totalUnderlying } = vault.data;
        setBalanceIsNotSuficient(false);

        if (totalUnderlying) {
          const ratioBN = totalUnderlying[1] / totalUnderlying[0];
          const ratio = Number(ratioBN);
          setTokenRatio(ratio);

          const depositValue = Object.keys(tokenBalanceData).reduce(
            (acc, token) => {
              const balance0Token =
                Number(tokenBalanceData[TokenSymbol.rETH]?.balanceInt || 0) /
                ratio;
              return {
                ...acc,
                [token]: {
                  depositValue: '0',
                  maxDepositValue:
                    token === TokenSymbol.WETH
                      ? balance0Token
                      : Number(tokenBalanceData.rETH?.balanceInt),
                },
              };
            },
            {},
          );
          setTokenDeposit(depositValue);
        }
      }
    }
  }, [vault, tokenBalance]);

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
      return 'Walet is disconnected';
    }
    if (balanceIsNotSuficient) {
      return 'Balance is not suficient';
    }
    return 'Submit';
  };

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        value.toString(),
      ]),
    );
    if (isError) {
      return;
    }
    setDepositValue(data);
    changeStep(StepType.Allowance);
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
        {balanceIsNotSuficient && (
          <MyAlert
            message={`You dont have enoug balace of ${tokensSymbols[0]} and /or ${tokensSymbols[1]}`}
            color="danger"
          />
        )}
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isDisabled={balanceIsNotSuficient || !address}
        >
          {getButtonText()}
        </Button>
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
