import type { PropsWithChildren } from 'react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { MainHeader } from '@/components/header/MainHeader';
import { MainNavbar } from '@/components/MainNavbar';

export function MainLayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <MainHeader />
      <main className="bg-slate-100">
        <div className="container mx-auto max-w-5xl grow">{props.children}</div>
      </main>
      <Footer />
    </div>
  );
}
