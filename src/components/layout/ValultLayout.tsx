import type { PropsWithChildren } from 'react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { MainNavbar } from '@/components/MainNavbar';

export function ValultLayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <main className="min-h-[80vh] bg-slate-100">
        <div className="mx-auto mb-12 max-w-screen-lg px-4">
          {props.children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
