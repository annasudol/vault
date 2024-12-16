import { TokenIcon } from '@/components/TokenIcon';
import type { TokenCollection } from '@/types';

interface VaultHeaderProps {
  title: string;
  tokens: TokenCollection;
}
const VaultHeader = ({ title, tokens }: VaultHeaderProps) => (
  <header className="mx-auto max-w-screen-lg p-4">
    <div className="mb-12 flex max-w-screen-lg justify-start">
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
