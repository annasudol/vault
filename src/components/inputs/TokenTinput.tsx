import { Input, Slider } from '@nextui-org/react';
import React from 'react';

type CustomInputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
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
  max,
}) => {
  return (
    <div className="w-full">
      <Input
        name={name}
        value={value}
        onValueChange={(val) => setValue(val)}
        label={label}
        labelPlacement="outside"
        isRequired={isRequired}
        errorMessage={errorMessage}
        type="number"
        className=""
        min={0}
        max={max}
      />
      {displaySlider && (
        <Slider
          className="max-w-md"
          color="foreground"
          defaultValue={Number(value)}
          label="Select a value"
          marks={[
            {
              value: 20,
              label: '20%',
            },
            {
              value: 50,
              label: '50%',
            },
            {
              value: 80,
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
