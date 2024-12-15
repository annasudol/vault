import type { PropsWithChildren } from 'react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { MainNavbar } from '@/components/MainNavbar';

export function ValultLayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <div className="container mx-auto max-w-3xl grow px-4">
        {props.children}
      </div>
      <Footer />
    </div>
  );
}
