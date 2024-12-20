import { Navbar } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

import { Logo } from '@/components/Logo';

const MainNavbar = () => (
  <Navbar className="w-full" shouldHideOnScroll>
    <div className="mx-auto flex w-full flex-wrap items-center justify-between">
      <nav className="py-6">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </nav>
      <ConnectButton />
    </div>
  </Navbar>
);

export { MainNavbar };
