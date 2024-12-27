import { Form } from '@nextui-org/react';
import React, { useContext, useState } from 'react';

import { INPUT_VALUE_PRECISION } from '@/constants/contract';
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance';
import { useTokenDeposit } from '@/hooks/useTokenDeposit';
import { VaultContext } from '@/providers/VaultProvider';
import { type TokenInfo, type TokensCollection, TokenSymbol } from '@/types';

import { SubmitButton } from '../button/SubmitButton';
import { TokenInput } from '../inputs/TokenTinput';
import { Loading } from '../Loading';
import { MyAlert } from '../MyAlert';

const DepositForm = () => {
  const { tokens, vaultData } = useContext(VaultContext) ?? {};
  // TODO display balance error
  const { balance, balanceCallStatus } = useGetTokenBalance(
    tokens as TokensCollection<TokenInfo>,
  );

  const [isError, setIsError] = useState(false);
  const { tokenDeposit, setTokenDeposit, balanceIsNotSufficient } =
    useTokenDeposit(vaultData?.ratio, balance);

  const handleUpdateTokenDepositValue = (token: string, value: string) => {
    const tokenRatio = vaultData?.ratio;
    if (tokenDeposit && tokenRatio && tokens) {
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

  return (
    <Form
      className="mx-auto mb-11 min-h-96 w-full p-4"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      {Object.entries(tokens || {}).map(([token]) => {
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
      {balanceIsNotSufficient && (
        <MyAlert
          message={`You dont have enough balace of ${Object.keys(tokens || {})[0]}
            and /or ${Object.keys(tokens || {})[1]}`}
          color="danger"
        />
      )}
      {balanceCallStatus.isError && (
        <div className="flex h-40 items-center justify-center">
          <MyAlert
            message="Error while reading tokens balance"
            color="danger"
          />
        </div>
      )}
      {balanceCallStatus.isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loading title="Reading tokens data" />
        </div>
      )}
      <SubmitButton isDisabled={balanceIsNotSufficient}>
        {balanceIsNotSufficient ? 'Balance is not suficient' : 'Submit'}
      </SubmitButton>
    </Form>
  );
};

export { DepositForm };
