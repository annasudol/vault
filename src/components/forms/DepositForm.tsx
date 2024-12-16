import { Button, Form } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { formatBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import { type TokenCollection, type TokenInfo, TokenSymbol } from '@/types';

const DepositForm = () => {
  const [tokensValue, setTokensValue] = useState<TokenCollection>({});
  const [tokenRatio, setTokenRatio] = useState(1);
  const [isError, setIsError] = useState(false);
  const { address } = useAccount();
  const { vault, fetchTokenBalance } = useStore();

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchTokenBalance(address);
  }, []);

  useEffect(() => {
    if ('data' in vault) {
      const { tokens, totalUnderlying } = vault.data;
      if (totalUnderlying && tokens) {
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

        const tokensValueupdatedWithMaxValue = Object.keys(tokens).reduce(
          (acc, token) => {
            const balance0Token = Number(tokens.rETH?.balanceInt || 0) / ratio;
            return {
              ...acc,
              [token]: {
                ...tokens[token],
                depositValue: '0',
                maxDepositValue:
                  token === TokenSymbol.WETH
                    ? balance0Token
                    : Number(tokens[token]?.balanceInt),
              },
            };
          },

          {},
        );
        setTokensValue(tokensValueupdatedWithMaxValue);
      }
    }
  }, [vault]);

  const handleUpdateTokenDepositValue = (
    token: string,
    value: string,
  ): void => {
    if ('data' in vault) {
      const updatedTokensValue = { ...tokensValue };
      const updatedToken = { ...tokensValue[token] };
      updatedToken.depositValue = value;
      updatedTokensValue[token] = updatedToken as TokenInfo;

      const valueAsNumber = parseFloat(value) || 0;
      const depositradio = tokenRatio;
      const tokenKeys: string[] = Object.keys(updatedTokensValue);

      if (tokenKeys[0] === token) {
        const tokenKeyAsset1: string = tokenKeys[1] || '';
        // Update token1 based on token0
        const updatedAsset1Value = (valueAsNumber * depositradio).toFixed(4);

        const newValue = {
          ...tokensValue,
          [token]: { ...tokensValue[token], depositValue: value },
          [tokenKeyAsset1]: {
            ...tokensValue[tokenKeyAsset1],
            depositValue: updatedAsset1Value,
          },
        };

        setTokensValue(newValue as unknown as TokenCollection);
      } else {
        const tokenKeyAsset0: string = tokenKeys[0] || '';
        const updatedAsset1Value = (valueAsNumber / depositradio).toFixed(6);
        const newValue = {
          ...tokensValue,
          [token]: { ...tokensValue[token], depositValue: value },
          [tokenKeyAsset0]: {
            ...tokensValue[tokenKeyAsset0],
            depositValue: updatedAsset1Value,
          },
        };
        setTokensValue(newValue as unknown as TokenCollection);
      }
    }
  };

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(isError);
    console.log(data);
  };
  console.log(tokensValue);

  return (
    <Form
      className="w-full max-w-xs"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      {tokenRatio}
      {Object.keys(tokensValue).map((token) => {
        return (
          <TokenInput
            key={token}
            name={token}
            value={tokensValue[token]?.depositValue || '0'}
            setValue={(value: string) =>
              handleUpdateTokenDepositValue(token as string, value)
            }
            max={tokensValue[token]?.maxDepositValue || 0}
            balance={tokensValue[token]?.balanceInt || '0'}
            label={`${token} Amount`}
            displaySlider={token === TokenSymbol.rETH}
            setError={setIsError}
          />
        );
      })}

      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  );
};

export { DepositForm };
