import { Button, Input, Slider } from '@nextui-org/react';
import React, { useEffect } from 'react';

type CustomInputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
  balance: string;
  isRequired?: boolean;
  displaySlider?: boolean;
  max?: number;
  setError: (value: boolean) => void;
};

const TokenInput: React.FC<CustomInputProps> = ({
  name,
  value,
  setValue,
  label,
  isRequired = true,
  displaySlider = false,
  balance,
  max = 0,
  setError,
}) => {
  const [errorMessages, setErrorMessages] = React.useState<string>();

  useEffect(() => {
    let erorMessage;
    if (Number(value) > max) {
      erorMessage = 'Value cannot be higher than max value';
    }
    if (Number(value) <= 0) {
      erorMessage = 'Value must be greater than 0';
    }
    const validValueRegex = /^0$|^[1-9]\d*(\.\d+)?$|^0\.\d+$/;
    if (!validValueRegex.test(value)) {
      erorMessage = 'Value must be avalid number';
    }
    setError(erorMessage !== undefined);

    setErrorMessages(erorMessage);
  }, [value]);
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
        errorMessage={errorMessages}
        isInvalid={Number(value) > max || Number(value) <= 0 || false}
        type="text"
        className=""
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
        onPress={() => setValue(max.toString())}
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
