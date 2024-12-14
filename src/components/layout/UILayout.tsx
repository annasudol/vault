import type { PropsWithChildren } from 'react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export function UILayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-3xl grow px-4">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
