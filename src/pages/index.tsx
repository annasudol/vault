import React from 'react';

import { DepositForm } from '@/components/deposit-form/DepositForm';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const Index = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="container mx-auto max-w-3xl grow">
      <DepositForm />
    </main>
    <Footer />
  </div>
);

export default Index;
