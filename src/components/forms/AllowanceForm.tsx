import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { SubmitButton } from '@/components/button/SubmitButton';
import { MyAlert } from '@/components/MyAlert';
import { TxLink } from '@/components/TxLink';
import { useIncreaseAllowance } from '@/hooks/useIncreaseAllowance';
import type { TokenSymbol, VaultData } from '@/types';

interface AllowanceProps {
  vault: VaultData;
  token: TokenSymbol;
  depositValue?: string;
  updateAllowance: (value: boolean) => void;
}

const AllowanceForm: React.FC<AllowanceProps> = ({
  depositValue,
  vault,
  token,
  updateAllowance,
}) => {
  const {
    tx,
    handleIncreaseAllowance,
    allowance,
    statusRead,
    statusWrite,
    argsError,
  } = useIncreaseAllowance({
    token: vault.tokens[token],
  });

  const [allowanceNeedsIncrease, setAllowanceNeedsIncrease] =
    useState<boolean>();

  useEffect(() => {
    const status = Number(allowance) < Number(depositValue);
    setAllowanceNeedsIncrease(status);
    updateAllowance(status);
  }, [allowance, vault]);

  const [displayedToasts, setDisplayedToasts] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    const toastIdError = `${token}-error`;
    const toastIdSuccess = `${token}-success`;

    if (statusWrite.isError && !displayedToasts.has(toastIdError)) {
      toast.error(`Error while increasing ${token} allowance`);
      setDisplayedToasts((prev) => new Set(prev).add(toastIdError));
    }

    if (statusWrite.isSuccess && tx && !displayedToasts.has(toastIdSuccess)) {
      toast.success(
        <div>
          <p>{`Increased ${token} allowance successfully`}</p>
          <TxLink txHash={tx} />
        </div>,
      );
      setDisplayedToasts((prev) => new Set(prev).add(toastIdSuccess));
    }
  }, [statusWrite, tx, token, displayedToasts]);

  return (
    <div className="my-4">
      <h3 className="text-lg font-medium">{token}</h3>
      <p>Allowance: {statusRead.isLoading ? '...loading' : allowance}</p>
      <p>Deposit Value: {depositValue}</p>
      {allowanceNeedsIncrease && (
        <SubmitButton
          onPress={() =>
            depositValue &&
            handleIncreaseAllowance({
              amount: depositValue,
            })
          }
          isLoading={statusWrite.isLoading}
          disabled={!depositValue}
        >
          Set {token} Allowance
        </SubmitButton>
      )}
      {allowanceNeedsIncrease === false && (
        <MyAlert
          color="success"
          message={`Allowance for ${token} is already set`}
        />
      )}
      {argsError ? (
        <MyAlert
          color="danger"
          message={`Wallet is not connected  or token is not recognized to get ${token} allowance`}
        />
      ) : (
        statusRead.isError && (
          <MyAlert
            color="danger"
            message={`Error while reading ${token} allowance`}
          />
        )
      )}
    </div>
  );
};

export { AllowanceForm };
