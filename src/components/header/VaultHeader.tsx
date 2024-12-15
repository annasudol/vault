import { TokenIcon } from '@/components/TokenIcon';
import type { TokenSymbol } from '@/types';

interface VaultHeaderProps {
  title: string;
  token1: TokenSymbol;
  token2: TokenSymbol;
}
const VaultHeader = ({ title, token1, token2 }: VaultHeaderProps) => (
  <header className="mx-auto max-w-screen-lg p-4">
    <div className="mb-12 flex max-w-screen-lg justify-between">
      <TokenIcon token={token1} />
      <TokenIcon token={token2} className="relative -left-5" />
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  </header>
);

export { VaultHeader };
