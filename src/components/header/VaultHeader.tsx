import { TokenIcon } from '@/components/TokenIcon';
import type { TokenCollection } from '@/types';

interface VaultHeaderProps {
  title: string;
  tokens: TokenCollection;
}
const VaultHeader = ({ title, tokens }: VaultHeaderProps) => (
  <header className="mx-auto max-w-screen-lg p-4">
    <div className="P-4 mb-12 flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
      <div className="flex justify-start">
        <TokenIcon token={Object.keys(tokens)[0]} />
        <TokenIcon
          token={Object.keys(tokens)[1]}
          className="relative -left-2 z-10"
        />
      </div>
      <h1 className="ml-2 text-4xl font-bold">{title}</h1>
    </div>
  </header>
);

export { VaultHeader };
