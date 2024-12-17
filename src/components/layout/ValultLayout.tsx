import type { PropsWithChildren } from 'react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { MainNavbar } from '@/components/MainNavbar';

export function ValultLayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <main className="bg-slate-100">
        <div className="container mx-auto max-w-screen-lg grow p-8">
          {props.children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
