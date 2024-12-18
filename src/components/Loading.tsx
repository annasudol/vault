import { Spinner } from '@nextui-org/react';

interface LoadingProps {
  title?: string;
}
const Loading = ({ title }: LoadingProps) => (
  <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
    {title && <p className="text-sky-950">{title}</p>}
    <Spinner size="lg" />
  </div>
);
export { Loading };
