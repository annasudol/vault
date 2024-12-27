'use client';

import type { ButtonProps } from '@nextui-org/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { MyButton } from '../MyButton';

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex w-full flex-col text-center">
      <MyButton
        type="submit"
        className=" min-w-56 disabled:opacity-50 disabled:hover:opacity-50"
        disabled={!address || props.isDisabled}
        {...props}
      >
        {!address ? 'Wallet is not connected' : children}
      </MyButton>
      {!address && (
        <button
          className="mt-4 text-center text-sm text-gray-500 underline hover:opacity-80"
          onClick={openConnectModal}
        >
          Connect your wallet
        </button>
      )}
    </div>
  );
};

export { SubmitButton };
