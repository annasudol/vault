import { Form } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetTokenBalance } from '@/hooks/useGetTokenBalance';
import { parseToBigInt } from '@/lib/formatBigInt';
import { VaultContext } from '@/providers/VaultProvider';
import type {
  DepositTokens,
  TokenDeposit,
  TokenInfo,
  TokensCollection,
} from '@/types';
import { StepType, TokenSymbol } from '@/types';

import { SubmitButton } from '../button/SubmitButton';
import { TokenInput } from '../inputs/TokenTinput';
import { MyAlert } from '../MyAlert';

const DepositForm = () => {
  const { address } = useAccount();
  const { tokens, vaultData, setStep, setDeposit } =
    useContext(VaultContext) ?? {};

  const [isError, setIsError] = useState(false);
  const { balance, balanceCallStatus } = useGetTokenBalance(
    tokens as TokensCollection<TokenInfo>,
  );
  const [tokenDeposit, setTokenDeposit] =
    useState<TokensCollection<TokenDeposit>>();

  const [balanceIsNotSufficient, setBalanceIsNotSufficient] = useState(false);

  useEffect(() => {
    if (balance) {
      setBalanceIsNotSufficient(
        Object.values(balance).some((token) => token.balanceInt === '0'),
      );
    }
  }, [balance]);

  const handleUpdateTokenDepositValue = (token: string, value: string) => {
    const tokenRatio = vaultData?.ratio;

    if (tokenRatio && tokens) {
      const tokenKey0 = Object.keys(tokens)[0] as TokenSymbol;
      const tokenKey1 = Object.keys(tokens)[1] as TokenSymbol;

      // update token0 and token1 based on token0 value
      if (token === tokenKey0) {
        const balance0 = Number(value);
        const balance1 = balance0 * tokenRatio;
        setTokenDeposit({
          [tokenKey1]: {
            deposit: balance1.toString(),
          },
          [token]: {
            deposit: value,
          },
        });
      } else {
        // update token1 and token0 based on token1 value
        const balance1 = Number(value);
        const balance0 = balance1 / tokenRatio;
        setTokenDeposit({
          ...tokenDeposit,
          [tokenKey0]: {
            deposit: balance0.toString(),
          },
          [token]: {
            deposit: value,
          },
        });
      }
    }
  };

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    if (isError) {
      return null;
    }
    const formData = new FormData(e.currentTarget);

    if (tokens) {
      const token0 = Object.keys(tokens)[0];
      const token1 = Object.keys(tokens)[1];

      if (token0 && token1) {
        if (formData.get(token0) === '0' && formData.get(token1) === '0') {
          setIsError(true);
          return null;
        }
        const datas: DepositTokens = {
          [token0]: {
            int: formData.get(token0) as string,
            bigInt: parseToBigInt(
              (formData.get(token0) as string) || '0',
              Object.values(tokens)[0]?.decimals || 18,
            ),
          },
          [token1]: {
            int: formData.get(token1) as string,
            bigInt: parseToBigInt(
              (formData.get(token1) as string) || '0',
              Object.values(tokens)[1]?.decimals || 18,
            ),
          },
        };
        if (setDeposit) {
          setDeposit(datas);
        }
        if (setStep) {
          setStep(StepType.Allowance);
        }
        return datas;
      }
    }
    return null;
  };

  return (
    <Form
      className="mx-auto mb-11 min-h-96 w-full p-4"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      {Object.entries(tokens || {}).map(([token], index) => {
        const tokenBalnceArr = balance && Object.values(balance);
        const tokenRatio = vaultData?.ratio;
        const tokenBalance = balance ? balance[token]?.balanceInt : '0';
        const maxValue =
          tokenBalnceArr &&
          tokenRatio &&
          (index === 0
            ? (Number(tokenBalnceArr[1]?.balanceInt) || 0) / tokenRatio
            : Number(tokenBalnceArr[1]?.balanceInt));
        const value = tokenDeposit && tokenDeposit[token]?.deposit;
        return (
          <TokenInput
            key={token}
            name={token}
            value={value || '0'}
            setValue={(val: string) =>
              handleUpdateTokenDepositValue(token, val as string)
            }
            balance={tokenBalance}
            max={maxValue || 0}
            label={`${token} Amount`}
            displaySlider={token === TokenSymbol.rETH}
            setError={setIsError}
            isError={isError}
          />
        );
      })}
      {balanceIsNotSufficient && address && (
        <MyAlert
          message={`You dont have enough balace of ${Object.keys(tokens || {})[0]}
            and / or ${Object.keys(tokens || {})[1]}`}
          color="danger"
        />
      )}
      {balanceCallStatus.isError && address && (
        <div className="flex h-40 items-center justify-center">
          <MyAlert
            message="Error while reading tokens balance"
            color="danger"
          />
        </div>
      )}
      <SubmitButton isDisabled={balanceIsNotSufficient} type="submit">
        {balanceIsNotSufficient ? 'Balance is not suficient' : 'Submit'}
      </SubmitButton>
    </Form>
  );
};

export { DepositForm };
