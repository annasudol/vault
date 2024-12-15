import { Navbar } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

import { Logo } from '@/components/Logo';

const MainNavbar = () => (
  <Navbar
    className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between px-4"
    shouldHideOnScroll
  >
    <>
      <div className="py-6">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </div>
      <ConnectButton />
    </>
  </Navbar>
);

export { MainNavbar };
