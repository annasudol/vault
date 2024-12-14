import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo } from '@/components/Logo';

const Navbar = () => (
  <div className="flex flex-wrap items-center justify-between">
    <div className="py-6">
      <Link href="/">
        <Logo size="md" />
      </Link>
    </div>
    <ConnectButton />
  </div>
);

export { Navbar };
