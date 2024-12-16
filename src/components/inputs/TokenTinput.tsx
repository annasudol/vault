import { Button, Input, Slider } from '@nextui-org/react';
import React from 'react';

type CustomInputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
  balance: string;
  errorMessage?: string;
  isRequired?: boolean;
  displaySlider?: boolean;
  max?: number;
};

const TokenInput: React.FC<CustomInputProps> = ({
  name,
  value,
  setValue,
  label,
  errorMessage = 'Please enter a number greater than 0',
  isRequired = true,
  displaySlider = false,
  balance,
  max = 0,
}) => {
  return (
    <div className="relative my-6 w-full">
      <span className="absolute right-1 text-xs text-gray-500">
        Balance: {balance} {name}
      </span>
      <Input
        name={name}
        value={value}
        onValueChange={(val) => setValue(val)}
        label={label}
        labelPlacement="outside"
        isRequired={isRequired}
        errorMessage={
          Number(value) > Number(max)
            ? 'Value cannot be higer than your balance'
            : errorMessage
        }
        type="number"
        className=""
        min={0}
        max={max}
      />
      <span className="text-right text-xs text-gray-500">
        max: {max.toFixed(2)} {name}
      </span>
      <Button
        size="sm"
        variant="bordered"
        color="primary"
        className="disabled:hover:none absolute right-1 top-7 disabled:cursor-not-allowed"
        disabled={max === 0 || value === max.toString()}
        onClick={() => setValue(max.toString())}
      >
        max
      </Button>

      {displaySlider && max > 0 && (
        <Slider
          className="mt-6 max-w-md"
          color="foreground"
          defaultValue={Number(value)}
          maxValue={max}
          value={Number(value)}
          onChange={(val) => setValue(val.toString())}
          label={`Select a ${name} value`}
          marks={[
            {
              value: max / 5,
              label: '20%',
            },
            {
              value: max / 2,
              label: '50%',
            },
            {
              value: max / 1.25,
              label: '80%',
            },
          ]}
          size="sm"
          step={10}
        />
      )}
    </div>
  );
};

export { TokenInput };
