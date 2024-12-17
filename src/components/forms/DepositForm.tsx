import { Button, Form } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { Loading } from '@/components/Loading';
import { MyAlert } from '@/components/MyAlert';
import { formatBigInt } from '@/lib/formatBigInt';
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
      if (balances.some((balance) => !balance.balanceInt)) {
        setBalanceIsNotSuficient(true);
      } else {
        const { tokens, totalUnderlying } = vault.data;
        setBalanceIsNotSuficient(false);

        if (totalUnderlying) {
          const balanceToken1 = formatBigInt(
            totalUnderlying[1],
            tokens[1]?.decimals || 18,
          );
          const balanceToken0 = formatBigInt(
            totalUnderlying[0],
            tokens[0]?.decimals || 18,
          );
          const ratio = Number(balanceToken1) / Number(balanceToken0);
          setTokenRatio(ratio);

          const depositValue = Object.keys(tokenBalanceData).reduce(
            (acc, token) => {
              const balance0Token =
                Number(tokenBalanceData[token]?.balanceInt || 0) / ratio;
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

    if (token === TokenSymbol.WETH) {
      const balance0 = Number(value);
      const balance1 = balance0 * tokenRatio;
      setTokenDeposit({
        ...tokenDeposit,
        [TokenSymbol.rETH]: {
          ...tokenDeposit[TokenSymbol.rETH],
          depositValue: balance1.toString(),
        },
        [token]: {
          ...tokenDeposit[token],
          depositValue: value,
        },
      });
    } else {
      const balance1 = Number(value);
      const balance0 = balance1 / tokenRatio;
      setTokenDeposit({
        ...tokenDeposit,
        [TokenSymbol.WETH]: {
          ...tokenDeposit[TokenSymbol.WETH],
          depositValue: balance0.toString(),
        },
        [token]: {
          ...tokenDeposit[token],
          depositValue: value,
        },
      });
    }
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
            message="Balance of some token is not suficient"
            color="warning"
          />
        )}

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
    );
  }
  if (vault.status === 'pending' || tokenBalance.status === 'pending') {
    return <Loading title="loading form" />;
  }
  return (
    <div className="flex h-40 items-center justify-center">
      <MyAlert message="Failed to fetch data" color="danger" />;
    </div>
  );
};

export { DepositForm };
