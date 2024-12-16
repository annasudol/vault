import { Button, Form } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TokenInput } from '@/components/inputs/TokenTinput';
import { formatBigInt } from '@/lib/formatBigInt';
import { useStore } from '@/store/store';
import type { TokenSymbol } from '@/types';

const DepositForm = () => {
  const [decimals, setDecimals] = useState<
    Record<TokenSymbol, number | undefined> | undefined
  >();
  const [wethAmount, setWethAmount] = useState({
    balance: '0',
    value: '0',
  });
  const [rethAmount, setRethAmount] = useState({
    balance: '0',
    value: '0',
  });
  const [submitted, setSubmitted] = React.useState({});
  const { address } = useAccount();
  const { vault, fetchTokenBalance, tokenBalance } = useStore();

  useEffect(() => {
    if (vault && 'data' in vault && vault.data && address) {
      fetchTokenBalance(address, vault.data.tokens);
    }
  }, [vault]);

  useEffect(() => {
    if ('data' in vault) {
      const decimalsObj =
        Object.keys(vault.data.tokens).length > 0
          ? Object.keys(vault.data.tokens).reduce(
              (acc, token) => ({
                ...acc,
                [token]: vault.data.tokens[token]?.decimals,
              }),
              {} as Record<TokenSymbol, number>,
            )
          : {};
      if (Object.values(decimalsObj).length > 0) {
        setDecimals(decimalsObj as Record<TokenSymbol, number | undefined>);
      }
    }
  }, [vault]);

  useEffect(() => {
    if ('data' in tokenBalance) {
      const wethDecimals = decimals?.WETH || 18;
      const wethBalance = formatBigInt(
        wethDecimals,
        tokenBalance.data?.WETH as bigint,
      );
      const rethDecimals = decimals?.rETH || 18;
      setWethAmount({ ...wethAmount, balance: wethBalance });
      const rethBalance = formatBigInt(
        rethDecimals,
        tokenBalance.data?.rETH as bigint,
      );

      setRethAmount({ ...rethAmount, balance: rethBalance });
    }
  }, [tokenBalance]);

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
      <TokenInput
        name="WETH"
        value={wethAmount.value}
        setValue={(value) => setWethAmount({ ...wethAmount, value })}
        max={Number(wethAmount.balance)}
        label="WETH Amount"
        displaySlider
      />

      <TokenInput
        name="RETH"
        value={rethAmount.value}
        setValue={(value) => setRethAmount({ ...rethAmount, value })}
        max={Number(rethAmount.balance)}
        label="RETH Amount"
      />
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
