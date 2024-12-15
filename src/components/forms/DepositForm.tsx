import { Button, Form } from '@nextui-org/react';
import React, { useState } from 'react';

import { TokenInput } from '@/components/inputs/TokenTinput';

const DepositForm = () => {
  const [wethAmount, setWethAmount] = useState('');
  const [rethAmount, setRethAmount] = useState('');
  const [submitted, setSubmitted] = React.useState({});

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
        value={wethAmount}
        setValue={setWethAmount}
        label="WETH Amount"
      />

      <TokenInput
        name="RETH"
        value={rethAmount}
        setValue={setRethAmount}
        label="RETH Amount"
      />
      <Button type="submit" variant="bordered">
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
