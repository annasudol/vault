import { useRouter } from 'next/router';

import { ButtonIcon, MyButton } from './MyButton';

type ErrorProps = {
  message: string;
  desription?: string;
};

const ErrorInfo = ({ message, desription }: ErrorProps) => {
  const router = useRouter();
  return (
    <div className="mx-4 flex min-h-[80vh] max-w-screen-lg flex-col items-center justify-center">
      <h1 className="py-2 text-2xl">{message}</h1>
      {desription && (
        <p className="mb-8 break-all px-4 py-2 text-gray-500">{desription}</p>
      )}
      <MyButton
        className="w-full max-w-48 text-white"
        onPress={() => router.push('/')}
        icon={ButtonIcon.ArrowLeft}
      >
        Go back
      </MyButton>
    </div>
  );
};

export { ErrorInfo };
