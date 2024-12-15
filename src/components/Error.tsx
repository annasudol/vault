import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

type ErrorProps = {
  message: string;
  desription?: string;
};

const Error = ({ message, desription }: ErrorProps) => {
  const router = useRouter();
  return (
    <div className="flex min-h-48 flex-col items-center justify-center">
      <h1 className="py-2 text-2xl">{message}</h1>
      {desription && <p className="mb-8 py-2 text-gray-500">{desription}</p>}
      <Button
        color="primary"
        className="w-full max-w-48 text-white"
        onClick={() => router.push('/')}
      >
        <MdOutlineKeyboardBackspace />
        Go back
      </Button>
    </div>
  );
};

export { Error };
