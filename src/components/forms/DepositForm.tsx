import { Form } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import type { Address } from 'viem';

import { ErrorInfo } from '@/components/Error';
import { TokenInput } from '@/components/inputs/TokenTinput';
import { INPUT_VALUE_PRECISION } from '@/constants/contract';
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance';
import { useTokenRatio } from '@/hooks/useTokenRatio';
import { useStore } from '@/store/store';
import { TokenSymbol } from '@/types';

import { SubmitButton } from '../button/SubmitButton';
import { Loading } from '../Loading';
import { MyAlert } from '../MyAlert';

const DepositForm = () => {
  const params = useParams<{ address: string }>();
  const vaultAddress = params?.address;
  const { balance, vaultAddressIsInvalid, tokensCallStatus } =
    useGetTokenBalance(vaultAddress as string);

  const { vaults } = useStore();
  const tokens = vaults[vaultAddress as keyof typeof vaults]?.tokens;
  const [isError, setIsError] = useState(false);

  const { tokenRatio, tokenDeposit, setTokenDeposit, balanceIsNotSufficient } =
    useTokenRatio(params.address as Address, balance);

  const handleUpdateTokenDepositValue = (token: string, value: string) => {
    if (!tokenDeposit || !tokenDeposit[token] || !tokenRatio || !tokens) {
      return;
    }
    const tokenKey0 = Object.keys(tokens)[0] as TokenSymbol;
    const tokenKey1 = Object.keys(tokens)[1] as TokenSymbol;

    // update token0 and token1 based on token0 value
    if (token === tokenKey0) {
      const balance0 = Number(value);
      const balance1 = balance0 * tokenRatio;

      setTokenDeposit({
        ...tokenDeposit,
        [tokenKey1]: {
          ...tokenDeposit[tokenKey1],
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
        [tokenKey0]: {
          ...tokenDeposit[tokenKey0],
          depositValue: balance0.toFixed(INPUT_VALUE_PRECISION),
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
    // if (isError) {
    //   return;
    // }
    // const formData = new FormData(e.currentTarget);

    // if ('data' in vault) {
    //   const { tokens } = vault[params.address as Address].data;
    //   const token0 = Object.keys(tokens)[0];
    //   const token1 = Object.keys(tokens)[1];

    //   if (token0 && token1) {
    //     if (formData.get(token0) === '0' && formData.get(token1) === '0') {
    //       setIsError(true);
    //       return;
    //     }
    //     const datas: DepositTokens = {
    //       [token0]: {
    //         int: formData.get(token0) as string,
    //         bigInt: parseToBigInt(
    //           formData.get(token0) as string,
    //           vault.data.tokens[token0]?.decimals || 18,
    //         ),
    //       },
    //       [token1]: {
    //         int: formData.get(token1) as string,
    //         bigInt: parseToBigInt(
    //           formData.get(token1) as string,
    //           vault.data.tokens[token1]?.decimals || 18,
    //         ),
    //       },
    //     };
    //     setDepositValue(datas);
    //     changeStep(StepType.Allowance);
    //   }
    // }
  };

  if (vaultAddressIsInvalid) {
    return (
      <div>
        <ErrorInfo
          message="Error"
          desription="The vault contract address is invalid"
        />
      </div>
    );
  }
  if (tokensCallStatus.isLoading) {
    return (
      <div>
        <Loading title="Reading tokens data" />
      </div>
    );
  }

  if (tokensCallStatus.isError && address) {
    return (
      <div>
        <MyAlert message="Error while reading tokens balance" color="danger" />
      </div>
    );
  }

  if (vaults && tokens) {
    return (
      <Form
        className="mx-auto mb-11 min-h-96 w-full p-4"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        {Object.entries(tokens).map(([token]) => {
          const tokenBalance = balance ? balance[token]?.balanceInt : '0';
          const maxValue = tokenDeposit
            ? tokenDeposit[token]?.maxDepositValue
            : 0;
          const value = tokenDeposit ? tokenDeposit[token]?.depositValue : '0';
          return (
            <TokenInput
              key={token}
              name={token}
              value={value || '0'}
              setValue={(val: string) =>
                handleUpdateTokenDepositValue(token, val as string)
              }
              balance={tokenBalance}
              max={maxValue}
              label={`${token} Amount`}
              displaySlider={token === TokenSymbol.rETH}
              setError={setIsError}
              isError={isError}
            />
          );
        })}
        {/* {balanceIsNotSufficient && (
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
        )} */}
        <SubmitButton disabled={balanceIsNotSufficient}>
          {balanceIsNotSufficient ? 'Balance is not suficient' : 'Submit'}
        </SubmitButton>
      </Form>
    );
  }
  return <Loading title="loading form" />;
};

export { DepositForm };
