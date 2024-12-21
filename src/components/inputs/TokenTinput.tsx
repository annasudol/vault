import { Button, Input, Slider } from '@nextui-org/react';
import React from 'react';
import { z } from 'zod';

type CustomInputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
  setError: (value: boolean) => void;
  isError: boolean;
  balance?: string;
  isRequired?: boolean;
  displaySlider?: boolean;
  max?: number;
};

const TokenInput: React.FC<CustomInputProps> = ({
  name,
  value,
  setValue,
  label,
  setError,
  isError,
  isRequired = true,
  displaySlider = false,
  balance,
  max = 0,
}) => {
  const [errorMessages, setErrorMessages] = React.useState<string>();

  const inputSchema = z
    .number({ invalid_type_error: 'Value must be a valid number' })
    .positive('Value must be greater than 0')
    .max(max, `Value cannot exceed the maximum of ${max.toFixed(2)}`);

  const handleChange = (val: string) => {
    try {
      const parsedValue = inputSchema.parse(Number(val));
      setValue(parsedValue.toString());
      setError(false); // Clear any existing errors
      setErrorMessages(undefined); // Clear error messages
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (error.errors[0] && error.errors[0].message) {
          setErrorMessages(error.errors[0].message);
        }
        setError(true);
      }
    }
  };

  return (
    <div className="relative my-6 w-full">
      {balance && (
        <span className="absolute right-1 text-xs text-gray-500">
          Balance: {balance} {name}
        </span>
      )}
      <Input
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        label={label}
        labelPlacement="outside"
        isRequired={isRequired}
        errorMessage={errorMessages}
        isInvalid={Boolean(errorMessages) || isError}
        disabled={max === 0}
        type="text"
      />
      {max > 0 && (
        <>
          <span className="text-right text-xs text-gray-500">
            max: {max.toFixed(2)} {name}
          </span>
          <Button
            size="sm"
            variant="bordered"
            color="primary"
            className="absolute right-1 top-7 disabled:cursor-not-allowed"
            onPress={() => handleChange(max.toString())}
          >
            max
          </Button>
        </>
      )}

      {displaySlider && max > 0 && (
        <Slider
          className="mt-6 max-w-md"
          color="foreground"
          defaultValue={Number(value)}
          maxValue={max}
          value={Number(value)}
          onChange={(val) => handleChange(val.toString())}
          label={`Select a ${name} value`}
          marks={[
            { value: max / 5, label: '20%' },
            { value: max / 2, label: '50%' },
            { value: max / 1.25, label: '80%' },
          ]}
          size="sm"
          step={1}
        />
      )}
    </div>
  );
};

export { TokenInput };
