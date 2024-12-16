import { Button, Form } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { useStore } from '@/store/store';
import type { TokenCollection, TokenInfo } from '@/types';

const DepositForm = () => {
  const [tokensValue, setTokensValue] = useState<TokenCollection>({});

  const [submitted, setSubmitted] = useState({});
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
      const { tokens } = vault.data;
      setTokensValue(tokens);
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
      const depositradio = vault.data?.depositRatio || 0;
      const tokenKeys: string[] = Object.keys(updatedTokensValue);

      if (tokenKeys[0] === token) {
        const tokenKeyAsset1: string = tokenKeys[1] || '';
        // Update token1 based on token0
        const updatedAsset1Value = (valueAsNumber * depositradio).toFixed();

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
        const updatedAsset1Value = (valueAsNumber / depositradio).toFixed();
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

    setSubmitted(data);
  };
  console.log(tokensValue);

  return (
    <Form
      className="w-full max-w-xs"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      {Object.keys(tokensValue).map((token) => {
        return (
          <TokenInput
            key={token}
            name={token}
            value={tokensValue[token]?.depositValue || '0'}
            setValue={(value) =>
              handleUpdateTokenDepositValue(token as string, value)
            }
            max={Number(tokensValue[token]?.balanceInt) || 0}
            label={`${token} Amount`}
            displaySlider
          />
        );
      })}
      <p>{tokensValue.WETH?.depositValue}WETH</p>
      <p>{tokensValue.rETH?.depositValue}rETH</p>

      <Button type="submit" color="primary">
        Submit
      </Button>
      {submitted && (
        <div className="text-small text-default-500">
          You submitted: <code>{JSON.stringify(submitted)}</code>
        </div>
      )}
    </Form>
  );
};

export { DepositForm };
