import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Address } from 'viem';

import { useLiquidity } from '@/hooks/useLiquidity';

import { SubmitButton } from '../button/SubmitButton';
import { MyAlert } from '../MyAlert';
import { TxLink } from '../TxLink';

const LiquidityForm = () => {
  const params = useParams<{ address: string }>();

  const { handleAddLiquidity, statusRead, statusWrite, tx } = useLiquidity({
    vaultAddress: params.address as Address,
  });

  const [displayedToasts, setDisplayedToasts] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    const toastIdError = `${tx}-error`;
    const toastIdSuccess = `${tx}-success`;

    if (statusWrite.isError && !displayedToasts.has(toastIdError)) {
      toast.error('Error while adding liquidity');
      setDisplayedToasts((prev) => new Set(prev).add(toastIdError));
    }

    if (statusWrite.isSuccess && tx && !displayedToasts.has(toastIdSuccess)) {
      toast.success(
        <div>
          <p>Transaction is succesfull</p>
          <TxLink txHash={tx} />
        </div>,
      );
      setDisplayedToasts((prev) => new Set(prev).add(toastIdSuccess));
    }
  }, [statusWrite, tx, displayedToasts]);

  if (statusRead.isError) {
    return <MyAlert color="danger" message="Error while reading mint values" />;
  }
  return (
    <div className="flex flex-col">
      <h1>Liquidity Form</h1>
      {tx ? (
        <MyAlert
          color="success"
          message="Liquidity has been added successfully"
        />
      ) : (
        <SubmitButton
          onPress={handleAddLiquidity}
          isLoading={statusRead.isLoading}
          type="button"
        >
          Submit
        </SubmitButton>
      )}
    </div>
  );
};

export { LiquidityForm };
