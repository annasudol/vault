import { Button, Form } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { useStore } from '@/store/store';
import type { TokenKeySymbol } from '@/types';

const DepositForm = () => {
  const [tokensValue, setTokensValue] = useState<TokenKeySymbol>({});

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
    const updatedTokensValue = { ...tokensValue };
    const updatedToken = { ...tokensValue[token] };
    const newValue = {
      ...updatedTokensValue,
      [token]: { ...updatedToken, depositValue: value },
    };
    setTokensValue(newValue as unknown as TokenKeySymbol);
  };

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);
  };

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
            max={tokensValue[token]?.balanceInt || 0}
            label={`${token} Amount`}
            displaySlider
          />
        );
      })}
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
