import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetTokenBalance } from '@/hooks/useGetTokenBalance';
import { useStore } from '@/store/store';

import { ErrorInfo } from '../Error';
import { ValultLayout } from '../layout/ValultLayout';
import type { Address } from 'viem';
import { useTokenRatio } from '@/hooks/useTokenRatio';
import { truncateString } from '@/lib/truncateString';
import { TokenSymbol } from '@/types';
import { Form } from '@nextui-org/react';
import { isError } from 'util';
import { SubmitButton } from '../button/SubmitButton';
import { TokenInput } from '../inputs/TokenTinput';
import { Loading } from '../Loading';
import { MyAlert } from '../MyAlert';
import { INPUT_VALUE_PRECISION } from '@/constants/contract';

const DepositForm = () => {
  // const { tokenBalance, setDepositValue, changeStep } = useStore();
  const params = useParams<{ address: string }>();
  const vaultAddress = params?.address;
  const { balance, vaultAddressIsInvalid } = useGetTokenBalance(
    vaultAddress as string,
  );
    // const saveTokenBalance = useStore((state) => state.saveTokenBalance);
  
  const { vaults } = useStore();
  const tokens = vaults[vaultAddress as keyof typeof vaults]?.tokens;
  const [isError, setIsError] = useState(false);


    const {tokenRatio,
      tokenDeposit,
      setTokenDeposit,
      balanceIsNotSufficient} = useTokenRatio(params.address as Address, balance);


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

  // const getButtonText = () => {
  //   if (!address) {
  //     return 'Wallet is disconnected';
  //   }
  //   if (balanceIsNotSufficient) {
  //     return 'Balance is not suficient';
  //   }
  //   return 'Submit';
  // };

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

  if (vaults && tokens && balance && tokenDeposit) {

    return (
      <Form
        className="mx-auto mb-11 min-h-96 w-full p-4"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        
         {Object.entries(tokens).map(([token]) => {
          const tokenBalance= balance[token]?.balanceInt;
          const maxValue =  tokenDeposit[token]?.maxDepositValue;
          const value = tokenDeposit[token]?.depositValue || '0';
          return (
            <TokenInput
              key={token}
              name={token}
              value={value}
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
        {/* <SubmitButton isDisabled={balanceIsNotSufficient || !address}>
          {getButtonText()}
        </SubmitButton> */}
      </Form>
    );
  }
  // if (vault.status === 'pending' || tokenBalance.status === 'pending') {
  //   return <Loading title="loading form" />;
  // }
  // if (vault.status === 'error' || tokenBalance.status === 'error') {
  //   const errorMessage = vault.message || 'Failed to fetch data';
  //   return (
  //     <div className="flex h-40 items-center justify-center">
  //       <MyAlert message={errorMessage} color="danger" />;
  //     </div>
  //   );
  // }

  if (vaultAddressIsInvalid) {
    return (
      <ValultLayout>
        <ErrorInfo
          message="Error"
          desription="The vault contract address is invalid"
        />
      </ValultLayout>
    );
  }
  return <></>;
};

export { DepositForm };
